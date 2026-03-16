export const extract = {
    code: `import pandas as pd
import os
from typing import Tuple

def extract_symptom_data(filepath: str) -> Tuple[pd.DataFrame, dict]:
    
    if not os.pathexists(filepath):
        raise FileNotFoundError("File not found: {filepath}")
    
    df = pd.read_csv(filepath, index_col=0)


    required_columns = ['label', 'text']
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        raise ValueError(f"Missing required columns: {missing_columns}") 
    
    print(f"Required columns verified: {required_columns}") # print the required columns

    # Generate summary statistics
    summary = {
        'total_rows': len(df),
        'total_columns': len(df.columns),
        'columns': list(df.columns), # list of the column names
        'null_counts': df.isnull().sum().to_dict(), # count the number of null values in each column
        'unique_labels': df['label'].nunique() if 'label' in df.columns else 0, # count the number of unique labels in the 'label' column
        'data_types': df.dtypes.to_dict()
    }
    
    # Log summary to console
    print(f"DATA SUMMARY:")
    print(f"   Total Rows: {summary['total_rows']:,}")
    print(f"   Total Columns: {summary['total_columns']}")
    print(f"   Unique Medical Specialties: {summary['unique_labels']}")
    
    return df, summary
`
}