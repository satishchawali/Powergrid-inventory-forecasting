import pandas as pd

def engineer_features():
    df = pd.read_csv("data/processed/material_forecast_cleaned.csv")

    # Create season feature
    def get_season(month):
        if month in [12, 1, 2]:
            return "Winter"
        elif month in [3, 4, 5]:
            return "Summer"
        else:
            return "Monsoon"

    df["season"] = df["month"].apply(get_season)

    # Budget category
    df["budget_category"] = pd.cut(
        df["project_budget"],
        bins=[0, 5000000, 20000000, 100000000],
        labels=["Low", "Medium", "High"]
    )

    df.to_csv("data/processed/material_forecast_cleaned.csv", index=False)

    print("Feature engineering completed.")

if __name__ == "__main__":
    engineer_features()
