export const main = {
    code: `import os
import sys
from datetime import datetime

# Ensure project root is on path for imports
sys.path.append(os.path.dirname(__file__))

from ETL.extract import extract_symptom_data
from ETL.transform import transform_symptom_data
from ETL.load import load_processed_data
from models.train import run_training_pipeline
from models.evaluate import run_evaluation_pipeline, evaluate_model


def run_etl_pipeline(
    input_path: str = "data/raw/Symptom2Disease.csv",
    output_csv: str = "data/processed/cleaned_symptoms.csv",
    output_db: str = "data/processed/etl_logs.db"
) -> dict:
    """
    Execute the ETL pipeline.
    
    Args:
        input_path: Path to raw input CSV file
        output_csv: Path to save cleaned CSV file
        output_db: Path to SQLite database for logs
        
    Returns:
        Dictionary containing pipeline execution summary
    """
    print("\n" + "="*70)
    print("PHASE 1: ETL PIPELINE")
    print("   Extract, Transform, Load")
    print("="*70)
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70 + "\\n")
    
    pipeline_start = datetime.now()
    
    try:
        # EXTRACT
        print("STEP 1: EXTRACT")
        df_raw, extract_summary = extract_symptom_data(input_path)
        
        # TRANSFORM
        print("\\nSTEP 2: TRANSFORM")
        df_transformed, vectorizer, transform_log = transform_symptom_data(df_raw)
        
        # LOAD
        print("\\nSTEP 3: LOAD")
        load_processed_data(df_transformed, transform_log, output_csv, output_db)
        
        # Calculate duration
        pipeline_end = datetime.now()
        duration = (pipeline_end - pipeline_start).total_seconds()
        
        # Generate summary
        summary = {
            'status': 'SUCCESS',
            'duration_seconds': duration,
            'input_file': input_path,
            'output_csv': output_csv,
            'output_db': output_db,
            'records_processed': {
                'initial': extract_summary['total_rows'],
                'final': transform_log['final_rows'],
                'removed': extract_summary['total_rows'] - transform_log['final_rows']
            },
            'transformations': {
                'nulls_removed': transform_log['null_rows_removed'],
                'duplicates_removed': transform_log['duplicate_rows_removed'],
                'translations': transform_log['translations_performed']
            },
            'feature_engineering': {
                'vocabulary_size': transform_log['vocabulary_size'],
                'unique_specialties': transform_log['unique_labels']
            }
        }
        
        # Print summary
        print("\\n" + "="*70)
        print("[OK] ETL PIPELINE COMPLETE")
        print("="*70)
        print(f"Duration: {duration:.2f} seconds")
        print(f"\\nData Processing:")
        print(f"   Initial records: {summary['records_processed']['initial']:,}")
        print(f"   Final records: {summary['records_processed']['final']:,}")
        print(f"   Records removed: {summary['records_processed']['removed']:,}")
        print(f"\\nTransformations Applied:")
        print(f"   Null rows removed: {summary['transformations']['nulls_removed']:,}")
        print(f"   Duplicate rows removed: {summary['transformations']['duplicates_removed']:,}")
        print(f"   Translations performed: {summary['transformations']['translations']:,}")
        print(f"\\nFeature Engineering:")
        print(f"   TF-IDF vocabulary size: {summary['feature_engineering']['vocabulary_size']:,}")
        print(f"   Medical specialties: {summary['feature_engineering']['unique_specialties']:,}")
        print(f"\\nOutput Files:")
        print(f"   Cleaned CSV: {output_csv}")
        print(f"   ETL Logs DB: {output_db}")
        print("="*70 + "\\n")
        
        return summary
        
    except Exception as e:
        print(f"\\n[ERROR] ETL Pipeline Error: {str(e)}")
        raise


def run_complete_pipeline(
    # ETL parameters
    raw_data_path: str = "data/raw/Symptom2Disease.csv",
    cleaned_csv_path: str = "data/processed/cleaned_symptoms.csv",
    etl_db_path: str = "data/processed/etl_logs.db",
    # Training parameters
    model_path: str = "artifacts/medical_model.joblib",
    indices_path: str = "artifacts/reports/test_indices.json",
    # Evaluation parameters
    vis_dir: str = "artifacts/visualizations",
    report_dir: str = "artifacts/reports",
    target_accuracy: float = 0.85
) -> dict:
    """
    Execute the complete pipeline: ETL -> Train -> Evaluate.
    
    Args:
        raw_data_path: Path to raw input CSV
        cleaned_csv_path: Path for cleaned CSV output
        etl_db_path: Path for ETL logs database
        model_path: Path to save trained model
        indices_path: Path to save test indices
        vis_dir: Directory for visualizations
        report_dir: Directory for reports
        target_accuracy: Hypothesis testing target
        
    Returns:
        Dictionary with complete pipeline results
    """
    overall_start = datetime.now()
    
    print("\\n" + "="*70)
    print("MEDICAL TRIAGE SYSTEM - COMPLETE PIPELINE")
    print("   WGU Capstone Project")
    print("="*70)
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70 + "\\n")
    
    try:
        # =====================================================================
        # PHASE 1: ETL
        # =====================================================================
        etl_summary = run_etl_pipeline(
            input_path=raw_data_path,
            output_csv=cleaned_csv_path,
            output_db=etl_db_path
        )
        
        # =====================================================================
        # PHASE 2: TRAINING
        # =====================================================================
        training_summary = run_training_pipeline(
            input_csv=cleaned_csv_path,
            output_model=model_path,
            indices_path=indices_path
        )
        
        # =====================================================================
        # PHASE 3: EVALUATION (using in-memory data from training)
        # =====================================================================
        print("\\n" + "="*70)
        print("PHASE 3: EVALUATION PIPELINE")
        print("   Metrics & Visualizations")
        print("="*70 + "\\n")
        
        # Use test data from training for evaluation
        import joblib
        pipeline = joblib.load(model_path)
        
        eval_results = evaluate_model(
            pipeline=pipeline,
            X_train=training_summary['test_data']['X_train'],
            X_test=training_summary['test_data']['X_test'],
            y_train=training_summary['test_data']['y_train'],
            y_test=training_summary['test_data']['y_test'],
            target_accuracy=target_accuracy,
            vis_dir=vis_dir,
            report_dir=report_dir
        )
        
        # =====================================================================
        # FINAL SUMMARY
        # =====================================================================
        overall_end = datetime.now()
        total_duration = (overall_end - overall_start).total_seconds()
        
        print("\\n" + "="*70)
        print("COMPLETE PIPELINE FINISHED")
        print("="*70)
        print(f"Total Duration: {total_duration:.2f} seconds")
        
        print(f"\\nMODEL PERFORMANCE:")
        print(f"   Accuracy:  {eval_results['metrics']['accuracy']*100:.2f}%")
        print(f"   Precision: {eval_results['metrics']['precision']*100:.2f}%")
        print(f"   Recall:    {eval_results['metrics']['recall']*100:.2f}%")
        print(f"   F1-Score:  {eval_results['metrics']['f1_score']*100:.2f}%")
        
        print(f"\\nHYPOTHESIS TEST:")
        print(f"   Target:    {eval_results['hypothesis_test']['target_accuracy']*100:.0f}%")
        print(f"   Achieved:  {eval_results['hypothesis_test']['achieved_accuracy']*100:.2f}%")
        print(f"   Result:    {eval_results['hypothesis_test']['conclusion']}")
        
        print(f"\\nALL DELIVERABLES:")
        print(f"   [OK] Cleaned Data: {cleaned_csv_path}")
        print(f"   [OK] ETL Logs: {etl_db_path}")
        print(f"   [OK] Trained Model: {model_path}")
        print(f"   [OK] Test Indices: {indices_path}")
        print(f"   [OK] Classification Report: {report_dir}/classification_report.csv")
        print(f"   [OK] Visualizations: {vis_dir}/")
        
        
        print(f"\\nNEXT STEP:")
        print(f"   Run: streamlit run src/ui/app.py")
        print("="*70)
        print(f"Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*70 + "\\n")
        
        return {
            'status': 'SUCCESS',
            'duration_seconds': total_duration,
            'etl': etl_summary,
            'training': training_summary,
            'evaluation': eval_results
        }
        
    except Exception as e:
        print(f"\\n[ERROR] Pipeline Error: {str(e)}")
        raise


if __name__ == "__main__":
    try:
        results = run_complete_pipeline()
        sys.exit(0)
    except Exception as e:
        print(f"\\n[ERROR] Pipeline failed: {e}")
        sys.exit(1)
`
}