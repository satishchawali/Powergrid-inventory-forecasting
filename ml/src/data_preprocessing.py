import pandas as pd
import os

def preprocess():
    raw_path = "data/raw/material_forecast_dataset.csv"
    processed_path = "data/processed/material_forecast_cleaned.csv"

    df = pd.read_csv(raw_path)

    # Handle missing values
    df.ffill(inplace=True)

    # Remove duplicates
    df.drop_duplicates(inplace=True)

    os.makedirs("data/processed", exist_ok=True)
    df.to_csv(processed_path, index=False)

    print("Data preprocessing completed.")

if __name__ == "__main__":
    preprocess()
