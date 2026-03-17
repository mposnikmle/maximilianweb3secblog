export const evaluate = {
    code: `import os
import sys
import json
import pandas as pd
import numpy as np
import joblib
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, precision_score, recall_score, f1_score
from typing import Dict, Tuple

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from src.visuals.plots import save_confusion_matrix, save_class_distribution, save_top_keywords

# Consistent split parameters (same as train.py)
TEST_SIZE = 0.2
RANDOM_STATE = 42


def load_model(model_path: str = "artifacts/medical_model.joblib"):

    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model not found at {model_path}. "
            "Please run training first (python3 src/models/train.py)"
        )
    
    print(f"Loading model from: {model_path}")
    pipeline = joblib.load(model_path)
    
    print(f"[OK] Model loaded successfully")
    print(f"   Pipeline steps: {list(pipeline.named_steps.keys())}")
    
    return pipeline


def load_data_and_split(
    csv_path: str = "data/processed/cleaned_symptoms.csv",
    indices_path: str = "artifacts/reports/test_indices.json",
    test_size: float = TEST_SIZE,
    random_state: int = RANDOM_STATE
) -> Tuple[pd.Series, pd.Series, pd.Series, pd.Series]:

    print(f"Loading data from: {csv_path}")
    df = pd.read_csv(csv_path)
    X = df["text"]
    y = df["label"]
    
    # Try to use saved indices for exact reproducibility
    if os.path.exists(indices_path):
        print(f"Loading saved test indices from: {indices_path}")
        with open(indices_path) as f:
            indices_data = json.load(f)
        test_idx = indices_data["test_indices"]
        
        # Use saved indices
        test_mask = X.index.isin(test_idx)
        X_test = X[test_mask]
        y_test = y[test_mask]
        X_train = X[~test_mask]
        y_train = y[~test_mask]
        
        print(f"[OK] Using saved indices: train={len(X_train):,}, test={len(X_test):,}")
    else:
        # Recreate split with same parameters
        print(f"[WARN] No saved indices found, recreating split (random_state={random_state})")
        X_train, X_test, y_train, y_test = train_test_split(
            X, y,
            test_size=test_size,
            random_state=random_state,
            stratify=y
        )
        print(f"[OK] Split recreated: train={len(X_train):,}, test={len(X_test):,}")
    
    return X_train, X_test, y_train, y_test


def generate_predictions(
    pipeline,
    X_test: pd.Series,
    y_test: pd.Series
) -> Tuple[np.ndarray, Dict]:

    # Predict
    y_pred = pipeline.predict(X_test)

    # Accuracy evaluation: precision, recall, F1-score, overall accuracy metrics
    # Calculate metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
    recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
    
    metrics = {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1_score': f1,
        'test_samples': len(X_test)
    }
    
    return y_pred, metrics


def evaluate_hypothesis(accuracy: float, target: float = 0.85) -> Dict:

    difference = accuracy - target
    percentage_diff = (difference / target) * 100
    hypothesis_met = accuracy >= target
    result = {
        'target_accuracy': target,
        'achieved_accuracy': accuracy,
        'difference': difference,
        'percentage_difference': percentage_diff,
        'hypothesis_met': hypothesis_met,
        'conclusion': 'ACCEPTED' if hypothesis_met else 'REJECTED'
    }
    
    return result


def generate_classification_report(
    y_test: pd.Series,
    y_pred: np.ndarray,
    output_dir: str = "artifacts/reports"
) -> pd.DataFrame:

    # Generate report
    report_dict = classification_report(y_test, y_pred, output_dict=True, zero_division=0)
    report_df = pd.DataFrame(report_dict).transpose()
    
    # Save to CSV
    os.makedirs(output_dir, exist_ok=True)
    report_path = os.path.join(output_dir, "classification_report.csv")
    report_df.to_csv(report_path)
    print(f"Classification report saved: {report_path}")
    
    return report_df


def evaluate_model(
    pipeline,
    X_train: pd.Series,
    X_test: pd.Series,
    y_train: pd.Series,
    y_test: pd.Series,
    target_accuracy: float = 0.85,
    vis_dir: str = "artifacts/visualizations",
    report_dir: str = "artifacts/reports"
) -> Dict:

    print("\nGenerating predictions and metrics...")

    # Generate predictions and metrics
    y_pred, metrics = generate_predictions(pipeline, X_test, y_test)
    
    # Hypothesis testing
    hypothesis_result = evaluate_hypothesis(metrics['accuracy'], target_accuracy)
    
    # Classification report
    report_df = generate_classification_report(y_test, y_pred, report_dir)
    
    # Generate all visualizations
    print("\nGenerating visualizations...")
    labels = sorted(y_test.unique())
    
    cm_path = save_confusion_matrix(
        y_true=y_test, 
        y_pred=y_pred, 
        labels=labels,
        output_path=os.path.join(vis_dir, "confusion_matrix.png")
    )
    print(f"   [OK] Confusion Matrix: {cm_path}")
    
    dist_path = save_class_distribution(
        y_train=y_train, 
        y_test=y_test,
        output_path=os.path.join(vis_dir, "class_distribution.png")
    )
    print(f"   [OK] Class Distribution: {dist_path}")
    
    keywords_path = save_top_keywords(
        pipeline=pipeline,
        output_path=os.path.join(vis_dir, "top_keywords.png")
    )
    print(f"   [OK] Top Keywords: {keywords_path}")
    
    # Compile results
    results = {
        'metrics': metrics,
        'hypothesis_test': hypothesis_result,
        'classification_report': report_df,
        'visualizations': {
            'confusion_matrix': cm_path,
            'class_distribution': dist_path,
            'top_keywords': keywords_path
        }
    }
    
    return results


def run_evaluation_pipeline(
    model_path: str = "artifacts/medical_model.joblib",
    data_csv: str = "data/processed/cleaned_symptoms.csv",
    indices_path: str = "artifacts/reports/test_indices.json",
    vis_dir: str = "artifacts/visualizations",
    report_dir: str = "artifacts/reports",
    target_accuracy: float = 0.85
) -> Dict:

    print("\n" + "="*70)
    print("MODEL EVALUATION PIPELINE")
    print("="*70)
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70 + "\n")
    
    try:
        # Step 1: Load model
        pipeline = load_model(model_path)
        
        # Step 2: Load data and recreate split
        X_train, X_test, y_train, y_test = load_data_and_split(
            csv_path=data_csv,
            indices_path=indices_path
        )
        
        # Step 3: Run full evaluation
        results = evaluate_model(
            pipeline=pipeline,
            X_train=X_train,
            X_test=X_test,
            y_train=y_train,
            y_test=y_test,
            target_accuracy=target_accuracy,
            vis_dir=vis_dir,
            report_dir=report_dir
        )
        
        # Print summary
        print("\n" + "="*70)
        print("[OK] EVALUATION COMPLETE")
        print("="*70)
        print(f"\nMODEL PERFORMANCE:")
        print(f"   Accuracy:  {results['metrics']['accuracy']*100:.2f}%")
        print(f"   Precision: {results['metrics']['precision']*100:.2f}%")
        print(f"   Recall:    {results['metrics']['recall']*100:.2f}%")
        print(f"   F1-Score:  {results['metrics']['f1_score']*100:.2f}%")
        
        print(f"\nHYPOTHESIS TEST:")
        print(f"   Target:    {results['hypothesis_test']['target_accuracy']*100:.0f}%")
        print(f"   Achieved:  {results['hypothesis_test']['achieved_accuracy']*100:.2f}%")
        print(f"   Result:    {results['hypothesis_test']['conclusion']}")
        
        print(f"\nDELIVERABLES:")
        print(f"   [OK] Classification Report: {report_dir}/classification_report.csv")
        print(f"   [OK] Confusion Matrix: {vis_dir}/confusion_matrix.png")
        print(f"   [OK] Class Distribution: {vis_dir}/class_distribution.png")
        print(f"   [OK] Top Keywords: {vis_dir}/top_keywords.png")
        print("="*70 + "\n")
        
        return {'status': 'SUCCESS', 'results': results}
        
    except Exception as e:
        print(f"\\n[ERROR] Evaluation Error: {str(e)}")
        raise


if __name__ == "__main__":
    run_evaluation_pipeline()
`
}