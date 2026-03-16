export const load = {
    code: `import pandas as pd
import sqlite3
import os
from datetime import datetime
from typing import Dict


def save_to_csv(df: pd.DataFrame, output_path: str) -> None:

    output_dir = os.path.dirname(output_path)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f" Created directory: {output_dir}")
    
    # Save to CSV
    print(f"Saving cleaned data to: {output_path}")
    df.to_csv(output_path, index=False)
    
    file_size = os.path.getsize(output_path)
    file_size_mb = file_size / (1024 * 1024)



def save_to_database(df: pd.DataFrame, transform_log: Dict, db_path: str = "data/processed/etl_logs.db") -> None:
    """
    Save processing summary to SQLite database with idempotency.
    
    Args:
        df: Cleaned DataFrame
        transform_log: Log dictionary from transform phase
        db_path: Path to SQLite database
    """
    # REQUIREMENT C - tools to monitor and maintain the product
    # Monitoring tool: SQLite database logs all ETL runs with timestamps, record counts, and data distribution
    # Enables tracking data quality metrics over time and detecting anomalies in pipeline execution
    
    print(f"\n{'='*60}")
    print("Database Persistence")
    print(f"{'='*60}\n")
    
    # Ensure database directory exists
    db_dir = os.path.dirname(db_path)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir)
        print(f"Created directory: {db_dir}")
    
    # Connect to database
    print(f"Connecting to database: {db_path}")
    conn = sqlite3.connect(db_path)
    
    # Create table if it doesn't exist 
    conn.execute("""
        CREATE TABLE IF NOT EXISTS processed_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            run_timestamp TEXT NOT NULL,
            medical_specialty TEXT NOT NULL,
            record_count INTEGER NOT NULL,
            percentage REAL NOT NULL,
            UNIQUE(run_timestamp, medical_specialty)
        )
    """)

    # Summary by medical specialty
    specialty_counts = df['label'].value_counts()
    total_records = len(df)
    timestamp = datetime.now().isoformat()

    # SQL injection prevention: Parameterized queries with placeholders (?) instead of string concatenation
    # Idempotent inserts via ON CONFLICT (no cursor)
    for specialty, count in specialty_counts.items():
        percentage = (count / total_records) * 100
        conn.execute("""
            INSERT INTO processed_logs (run_timestamp, medical_specialty, record_count, percentage)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(run_timestamp, medical_specialty) DO UPDATE SET
            record_count = excluded.record_count,
            percentage   = excluded.percentage
        """, (timestamp, specialty, int(count), float(percentage)))

    conn.commit()

    print("Table 'processed_logs' ready")
    print(f"SPECIALTY DISTRIBUTION:")
    for specialty, count in specialty_counts.items():
        percentage = (count / total_records) * 100
        print(f"   {specialty}: {count:,} records ({percentage:.2f}%)")

    total_db_rows = conn.execute("SELECT COUNT(*) FROM processed_logs").fetchone()[0]
    print(f"Database Summary:")
    print(f"   Records inserted/updated this run: {len(specialty_counts)}")
    print(f"   Timestamp: {timestamp}")
    print(f"   Total database rows: {total_db_rows}")

    conn.close()
    print(f" Database persistence completed")
    print(f"{'='*60}\n")


def load_processed_data(df: pd.DataFrame, transform_log: Dict, 
                        csv_path: str = "data/processed/cleaned_symptoms.csv",
                        db_path: str = "data/processed/etl_logs.db") -> None:
    # Save to CSV
    save_to_csv(df, csv_path)
    
    # Save to database
    save_to_database(df, transform_log, db_path)
    
    print(" LOAD PHASE COMPLETED SUCCESSFULLY")`
}