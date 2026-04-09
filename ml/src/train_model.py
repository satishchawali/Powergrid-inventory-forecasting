import pandas as pd
import joblib
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import r2_score, mean_absolute_error
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from lightgbm import LGBMRegressor
import os
import warnings


def train():
    warnings.filterwarnings("ignore")
    df = pd.read_csv("data/processed/material_forecast_cleaned.csv")

    X = df.drop("quantity", axis=1)
    y = df["quantity"]

    categorical = ["region", "tower_type", "material_name", "season", "budget_category"]
    numerical = ["project_budget", "month_sin", "month_cos", "weather_index", "lead_time_days", "budget_intensity"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
            ("num", StandardScaler(), numerical)
        ]
    )

    # ================= MODELS =================
    models = {
        "XGBoost": (
            XGBRegressor(objective='reg:squarederror', random_state=42, n_jobs=-1),
            {
                'regressor__n_estimators': [100, 200],
                'regressor__max_depth': [3, 6],
                'regressor__learning_rate': [0.05, 0.1]
            }
        ),

        "RandomForest": (
            RandomForestRegressor(random_state=42, n_jobs=-1),
            {
                'regressor__n_estimators': [100, 200],
                'regressor__max_depth': [10, None]
            }
        ),

        "LightGBM": (
            LGBMRegressor(random_state=42),
            {
                'regressor__n_estimators': [100, 200],
                'regressor__learning_rate': [0.05, 0.1],
                'regressor__num_leaves': [31, 50]
            }
        )
    }

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.15, random_state=42
    )

    best_model = None
    best_score = -np.inf

    os.makedirs("models", exist_ok=True)

    # ================= TRAINING LOOP =================
    for name, (model, param_grid) in models.items():
        print(f"\n🚀 Training {name}...")

        pipeline = Pipeline([
            ("preprocessor", preprocessor),
            ("regressor", model)
        ])

        grid = GridSearchCV(
            pipeline,
            param_grid,
            cv=3,
            scoring='r2',
            n_jobs=-1,
            verbose=1
        )

        grid.fit(X_train, y_train)

        # Fix: ensure DataFrame with column names
        preds = grid.best_estimator_.predict(X_test)

        r2 = r2_score(y_test, preds)
        mae = mean_absolute_error(y_test, preds)

        print(f"{name} R2: {round(r2, 4)}")
        print(f"{name} MAE: {round(mae, 2)}")
        print(f"{name} Best Params: {grid.best_params_}")

        # Save each model
        joblib.dump(grid.best_estimator_, f"models/{name}_model.pkl")

        # Track best model
        if r2 > best_score:
            best_score = r2
            best_model = grid.best_estimator_

    # Save best model separately
    joblib.dump(best_model, "models/best_model.pkl")

    print("\n✅ All models trained successfully!")
    print(f"🏆 Best Model R2 Score: {round(best_score, 4)} saved as best_model.pkl")

if __name__ == "__main__":
    train()