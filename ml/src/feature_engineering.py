import pandas as pd
from config import RAW_DATA_PATH, PROCESSED_DATA_PATH

def engineer_features():
    df = pd.read_csv(RAW_DATA_PATH)

    df = df.sort_values(["material_id", "year", "month"])

    # Lag feature
    df["demand_lag_1"] = df.groupby("material_id")["historical_demand"].shift(1)

    # Stock coverage
    df["stock_coverage_days"] = df["current_stock"] / df["avg_consumption_rate"]

    # Lead time risk
    df["lead_time_risk"] = df["lead_time_days"] * df["avg_consumption_rate"]

    df.dropna(inplace=True)
    df.to_csv(PROCESSED_DATA_PATH, index=False)

    print("Feature engineering completed")

if __name__ == "__main__":
    engineer_features()
