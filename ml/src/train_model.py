import pandas as pd
import joblib
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from xgboost import XGBRegressor
from sklearn.metrics import r2_score, mean_absolute_error
import os

def train():
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

    # XGBoost is a top-tier model for tabular data
    model = XGBRegressor(
        objective='reg:squarederror',
        random_state=42,
        n_jobs=-1
    )

    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("regressor", model)
    ])

    # XGBoost Specific Hyperparameters
    param_grid = {
        'regressor__n_estimators': [100, 200, 300],
        'regressor__max_depth': [3, 6, 9],
        'regressor__learning_rate': [0.01, 0.1, 0.2],
        'regressor__subsample': [0.8, 1.0],
        'regressor__colsample_bytree': [0.8, 1.0]
    }

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.15, random_state=42
    )

    print("Beginning XGBoost Grid Search...")
    grid_search = GridSearchCV(pipeline, param_grid, cv=3, scoring='r2', n_jobs=-1, verbose=1)
    grid_search.fit(X_train, y_train)

    best_pipeline = grid_search.best_estimator_
    preds = best_pipeline.predict(X_test)
    
    score = r2_score(y_test, preds)
    mae = mean_absolute_error(y_test, preds)

    print(f"XGBoost Model R2 Score: {round(score, 4)}")
    print(f"XGBoost Model MAE: {round(mae, 2)}")
    print(f"Best Params: {grid_search.best_params_}")

    os.makedirs("models", exist_ok=True)
    joblib.dump(best_pipeline, "models/material_model.pkl")

    print("Master XGBoost model saved successfully.")

if __name__ == "__main__":
    train()
