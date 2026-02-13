import pandas as pd
from config import RAW_DATA_PATH

def validate_data():
    df = pd.read_csv(RAW_DATA_PATH)

    assert df.isnull().sum().sum() == 0, "Missing values found"
    assert df["month"].between(1, 12).all(), "Invalid month"
    assert df["weather_index"].between(0, 1).all(), "Invalid weather index"
    assert (df["current_stock"] >= 0).all(), "Negative stock"

    print("Raw data validation passed")
    return df

if __name__ == "__main__":
    validate_data()
