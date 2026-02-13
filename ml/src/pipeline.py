import sys
import os

# Ensure the current directory is in the path to allow imports if running from outside
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from export_data import export_current_data
    from data_validation import validate_data
    from feature_engineering import engineer_features
    from preprocess import preprocess
    from train_model import train
    from evaluate import evaluate
    from predict import predict_demand
except ImportError as e:
    print(f"Error importing modules: {e}")
    print("Make sure you are running this script from the project root or ml/src directory.")
    sys.exit(1)

def run_pipeline():
    print("Starting ML Pipeline...")

    print("\n--- Step 1: Data Extraction ---")
    try:
        export_current_data()
    except Exception as e:
        print(f"Error in Data Extraction: {e}")
        return

    print("\n--- Step 2: Data Validation ---")
    try:
        validate_data()
    except Exception as e:
        print(f"Error in Data Validation: {e}")
        return

    print("\n--- Step 3: Feature Engineering ---")
    try:
        engineer_features()
    except Exception as e:
        print(f"Error in Feature Engineering: {e}")
        return

    print("\n--- Step 4: Preprocessing ---")
    try:
        preprocess()
    except Exception as e:
        print(f"Error in Preprocessing: {e}")
        return

    print("\n--- Step 5: Model Training ---")
    try:
        train()
    except Exception as e:
        print(f"Error in Model Training: {e}")
        return

    print("\n--- Step 6: Model Evaluation ---")
    try:
        evaluate()
    except Exception as e:
        print(f"Error in Model Evaluation: {e}")
        return

    print("\n--- Pipeline Completed Successfully ---")

if __name__ == "__main__":
    run_pipeline()
