export const train = {
    code: `import os
import sys
import json
import pandas as pd
import numpy as np
import joblib
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from typing import Tuple, Dict

# Consistent split parameters (used by both train and evaluate)
TEST_SIZE = 0.2
RANDOM_STATE = 42

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))


def load_cleaned_data(filepath: str = "data/processed/cleaned_symptoms.csv") -> Tuple[pd.DataFrame, Dict]:

    if not os.path.exists(filepath):
        raise FileNotFoundError(
            f"Cleaned data not found at {filepath}. "
            "Please run the ETL pipeline first (python3 src/main.py)"
        )
    
    print(f"Loading cleaned data from: {filepath}")
    df = pd.read_csv(filepath)
    
    metadata = {
        'total_records': len(df),
        'unique_specialties': df['label'].nunique(),
        'specialty_counts': df['label'].value_counts().to_dict(),
        'avg_text_length': df['text'].str.len().mean()
    }
    
    print(f"Loaded {metadata['total_records']:,} records across {metadata['unique_specialties']} specialties.")
    
    return df, metadata


def create_train_test_split(
    df: pd.DataFrame, 
    test_size: float = TEST_SIZE, 
    random_state: int = RANDOM_STATE
) -> Tuple[pd.Series, pd.Series, pd.Series, pd.Series, list]:

    X = df['text']
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, 
        test_size=test_size, 
        random_state=random_state,
        stratify=y  # Maintain class distribution in both sets
    )
    
    # Save test indices for reproducible evaluation
    test_indices = X_test.index.tolist()
    
    print(f"Split: train={len(X_train):,}, test={len(X_test):,} (stratified, random_state={random_state})")
    
    return X_train, X_test, y_train, y_test, test_indices


def save_split_indices(
    test_indices: list,
    output_path: str = "artifacts/reports/test_indices.json",
    test_size: float = TEST_SIZE,
    random_state: int = RANDOM_STATE
) -> str:

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    indices_data = {
        "test_indices": test_indices,
        "meta": {
            "test_size": test_size,
            "random_state": random_state,
            "timestamp": datetime.now().isoformat()
        }
    }
    
    with open(output_path, "w") as f:
        json.dump(indices_data, f, indent=2)
    
    print(f"Saved test indices to: {output_path}")
    return output_path


def build_model_pipeline() -> Pipeline:

    # TF-IDF Vectorizer configuration
    tfidf = TfidfVectorizer(
        max_features=5000,
        stop_words='english',
        ngram_range=(1, 2),  # Unigrams and bigrams
        min_df=2,            # Ignore terms appearing in < 2 documents
        max_df=0.95,         # Ignore terms appearing in > 95% of documents
        sublinear_tf=True    # Use log scaling for term frequency
    )
    
    # Multinomial Naive Bayes classifier
    # Alpha = 1.0 (Laplace smoothing to handle zero probabilities)
    nb_classifier = MultinomialNB(alpha=1.0)
    
    # Create pipeline
    pipeline = Pipeline([
        ('tfidf', tfidf),
        ('classifier', nb_classifier)
    ])
    
    print("Pipeline: TF-IDF + MultinomialNB")
    
    return pipeline


def train_model(
    pipeline: Pipeline,
    X_train: pd.Series,
    y_train: pd.Series
) -> Tuple[Pipeline, Dict]:

    print("Training model...")
    start_time = datetime.now()
    
    # Fit the pipeline
    pipeline.fit(X_train, y_train)
    
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()
    
    # Extract feature names and vocabulary size
    tfidf_vectorizer = pipeline.named_steps['tfidf']
    vocabulary_size = len(tfidf_vectorizer.vocabulary_)
    
    metadata = {
        'training_samples': len(X_train),
        'unique_classes': y_train.nunique(),
        'vocabulary_size': vocabulary_size,
        'training_duration_seconds': duration,
        'timestamp': datetime.now().isoformat()
    }
    
    print(f"Trained in {duration:.2f}s | samples={metadata['training_samples']:,} | vocab={metadata['vocabulary_size']:,}")
    
    return pipeline, metadata


def save_model(
    pipeline: Pipeline,
    output_path: str = "artifacts/medical_model.joblib"
) -> None:

    # Ensure output directory exists
    output_dir = os.path.dirname(output_path)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
    print(f"Created directory: {output_dir}")
    
    # Save model using joblib
    print(f"Saving model to: {output_path}")
    joblib.dump(pipeline, output_path)
    
    # Verify save and get file size
    file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
    
    print(f"Saved ({file_size_mb:.2f} MB)")


def run_training_pipeline(
    input_csv: str = "data/processed/cleaned_symptoms.csv",
    output_model: str = "artifacts/medical_model.joblib",
    indices_path: str = "artifacts/reports/test_indices.json",
    test_size: float = TEST_SIZE,
    random_state: int = RANDOM_STATE
) -> Dict:

    print("\\n" + "="*70)
    print("MODEL TRAINING PIPELINE")
    print("="*70)
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70 + "\\n")
    
    try:
        # Step 1: Load data
        df, data_metadata = load_cleaned_data(input_csv)
        
        # Step 2: Create train/test split
        X_train, X_test, y_train, y_test, test_indices = create_train_test_split(
            df, test_size=test_size, random_state=random_state
        )
        
        # Step 3: Save test indices for reproducible evaluation
        save_split_indices(test_indices, indices_path, test_size, random_state)
        
        # Step 4: Build pipeline
        pipeline = build_model_pipeline()
        
        # Step 5: Train model
        trained_pipeline, train_metadata = train_model(pipeline, X_train, y_train)
        
        # Step 6: Save model
        save_model(trained_pipeline, output_model)
        
        # Compile summary
        summary = {
            'status': 'SUCCESS',
            'data': data_metadata,
            'training': train_metadata,
            'split': {
                'train_size': len(X_train),
                'test_size': len(X_test),
                'test_ratio': test_size,
                'random_state': random_state
            },
            'model_path': output_model,
            'indices_path': indices_path,
            'test_data': {'X_test': X_test, 'y_test': y_test, 'X_train': X_train, 'y_train': y_train}
        }
        
        print("\\n" + "="*70)
        print("[OK] TRAINING COMPLETE")
        print("="*70)
        print(f"   Model saved: {output_model}")
        print(f"   Test indicnes: {indices_path}")
        print(f"   Train samples: {len(X_train):,}")
        print(f"   Test samples: {len(X_test):,}")
        print("="*70 + "\\n")
        
        return summary
        
    except Exception as e:
        print(f"\\n[ERROR] Training Error: {str(e)}")
        raise


if __name__ == "__main__":
    summary = run_training_pipeline()
    print(f"Summary: {summary['data']['unique_specialties']} classes | vocab={summary['training']['vocabulary_size']:,}")
 `
}