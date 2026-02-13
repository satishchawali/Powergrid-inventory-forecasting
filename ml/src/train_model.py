import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import r2_score
import os

def train():

    df = pd.read_csv("data/processed/material_forecast_cleaned.csv")

    X = df.drop("quantity", axis=1)
    y = df["quantity"]

    categorical = ["region", "tower_type", "material_name", "season", "budget_category"]
    numerical = ["project_budget", "month", "year", "weather_index", "lead_time_days"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
            ("num", "passthrough", numerical)
        ]
    )

    models = {
        "RandomForest": RandomForestRegressor(n_estimators=200, random_state=42),
        "GradientBoosting": GradientBoostingRegressor()
    }

    best_score = -1
    best_model = None

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    for name, regressor in models.items():
        pipeline = Pipeline([
            ("preprocessor", preprocessor),
            ("regressor", regressor)
        ])

        pipeline.fit(X_train, y_train)
        preds = pipeline.predict(X_test)
        score = r2_score(y_test, preds)

        print(f"{name} R2 Score: {round(score, 4)}")

        if score > best_score:
            best_score = score
            best_model = pipeline

    os.makedirs("models", exist_ok=True)
    joblib.dump(best_model, "models/material_model.pkl")

    print("Best model saved successfully.")

if __name__ == "__main__":
    train()
