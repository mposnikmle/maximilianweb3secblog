export const transform = {
    code: `import pandas as pd
import re
from typing import Tuple
from sklearn.feature_extraction.text import TfidfVectorizer


def clean_data(df: pd.DataFrame) -> Tuple[pd.DataFrame, dict]:

    initial_rows = len(df)
    log = {
        'initial_rows': initial_rows,
        'null_rows_removed': 0,
        'duplicate_rows_removed': 0,
        'final_rows': 0
    }
    
    # Check for null values in required columns
    null_count_before = df[['text', 'label']].isna().to_numpy().sum()
    print(f"Initial null values in 'text' and 'label': {null_count_before}")
    
    # Drop rows with null values in text or label columns
    df_cleaned = df.dropna(subset=['text', 'label'])
    rows_after_null_removal = len(df_cleaned)
    log['null_rows_removed'] = initial_rows - rows_after_null_removal
    
    if log['null_rows_removed'] > 0:
        print(f" Removed {log['null_rows_removed']} rows with null values")
    else:
        print(f" No null values found")
    
    # Remove duplicate symptom entries
    duplicates_before = df_cleaned.duplicated(subset=['text']).sum()
    print(f"Duplicate symptom entries found: {duplicates_before}")
    
    df_cleaned = df_cleaned.drop_duplicates(subset=['text'], keep='first')
    rows_after_duplicate_removal = len(df_cleaned)
    log['duplicate_rows_removed'] = rows_after_null_removal - rows_after_duplicate_removal
    
    if log['duplicate_rows_removed'] > 0:
        print(f" Removed {log['duplicate_rows_removed']} duplicate rows")
    else:
        print(f" No duplicates found")
    
    log['final_rows'] = rows_after_duplicate_removal
    
    # Reset index
    df_cleaned = df_cleaned.reset_index(drop=True)
    
    print(f"CLEANING SUMMARY:")
    print(f"   Initial rows: {log['initial_rows']:,}")
    print(f"   Rows removed (nulls): {log['null_rows_removed']:,}")
    print(f"   Rows removed (duplicates): {log['duplicate_rows_removed']:,}")
    print(f"   Final rows: {log['final_rows']:,}")
    print(f"   Retention rate: {(log['final_rows'] / log['initial_rows'] * 100):.2f}%")
    
    return df_cleaned, log


def preprocess_text(text: str) -> str:
    # Convert to lowercase
    text = text.lower()
    
    # Strip leading/trailing whitespace
    text = text.strip()
    
    # Remove any character not in this allowlist: letters a–z, digits 0–9, spaces, and . , ! ? ' - (regex: r'[^a-z0-9\\s.,!?\\'\\-]')
    text = re.sub(r'[^a-z0-9\\s.,!?\\'\\-]', '', text)
    
    # Remove multiple spaces
    text = re.sub(r'\\s+', ' ', text)
    
    return text


def transform_symptom_data(df: pd.DataFrame) -> Tuple[pd.DataFrame, TfidfVectorizer, dict]:

    # Clean data
    df_cleaned, cleaning_log = clean_data(df)
    
    # Preprocess text
    df_cleaned['text'] = df_cleaned['text'].apply(preprocess_text)
    
    
    # Feature preparation with TF-IDF
    print(" Initializing TF-IDF Vectorizer...")
    vectorizer = TfidfVectorizer(
        max_features=5000,
        stop_words='english',
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.95
    )
    
    # Fit the vectorizer (don't transform yet, just prepare it)
    print(" Fitting TF-IDF vectorizer on cleaned text...")
    vectorizer.fit(df_cleaned['text'])
    
    vocabulary_size = len(vectorizer.vocabulary_)
    print(f" TF-IDF vectorizer fitted")
    print(f"   Vocabulary size: {vocabulary_size:,} terms")
    print(f"   N-gram range: {vectorizer.ngram_range}")
    print(f"   Max features: {vectorizer.max_features}")
    
    # Create transformation log
    transform_log = {
        **cleaning_log,
        'vocabulary_size': vocabulary_size,
        'unique_labels': df_cleaned['label'].nunique(),
        'label_distribution': df_cleaned['label'].value_counts().to_dict()
    }
    
    print(f"Transform phase completed successfully")
    
    return df_cleaned, vectorizer, transform_log`
}