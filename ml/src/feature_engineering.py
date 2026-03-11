import pandas as pd
import numpy as np

def engineer_features():
    df = pd.read_csv("data/processed/material_forecast_cleaned.csv")

    # 1. Cyclic encoding for month (very important for seasonality)
    df["month_sin"] = np.sin(2 * np.pi * df["month"] / 12)
    df["month_cos"] = np.cos(2 * np.pi * df["month"] / 12)

    # 2. Refined Season feature
    def get_season(month):
        if month in [12, 1, 2]: return "Winter"
        elif month in [3, 4, 5]: return "Summer"
        elif month in [6, 7, 8, 9]: return "Monsoon"
        else: return "Autumn"

    df["season"] = df["month"].apply(get_season)

    # 3. Budget category refined for 5M-13M range
    df["budget_category"] = pd.cut(
        df["project_budget"],
        bins=[0, 7500000, 11000000, 30000000],
        labels=["Compact", "Moderate", "Large"]
    )

    # 4. Interaction features (Budget per month estimate)
    df["budget_intensity"] = df["project_budget"] / (df["lead_time_days"] + 1)

    df.to_csv("data/processed/material_forecast_cleaned.csv", index=False)
    print("Feature engineering completed with cyclic encoding and refined bins.")

if __name__ == "__main__":
    engineer_features()
