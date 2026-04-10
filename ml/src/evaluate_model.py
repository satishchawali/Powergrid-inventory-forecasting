import pandas as pd
import joblib
import matplotlib.pyplot as plt
import os
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

def evaluate():

    df = pd.read_csv("data/processed/material_forecast_cleaned.csv")

    X = df.drop("quantity", axis=1)
    y = df["quantity"]

    # ✅ Proper evaluation using test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.15, random_state=42
    )

    models = {
        "XGBoost": "models/XGBoost_model.pkl",
        "RandomForest": "models/RandomForest_model.pkl",
        "LightGBM": "models/LightGBM_model.pkl"
    }

    results = []

    os.makedirs("reports/figures", exist_ok=True)

    for name, path in models.items():
        print(f"\n📊 Evaluating {name}...")

        model = joblib.load(path)

        preds = model.predict(X_test)

        r2 = r2_score(y_test, preds)
        mae = mean_absolute_error(y_test, preds)
        rmse = np.sqrt(mean_squared_error(y_test, preds))

        print(f"{name} R2: {round(r2, 4)}")
        print(f"{name} MAE: {round(mae, 2)}")
        print(f"{name} RMSE: {round(rmse, 2)}")

        results.append({
            "Model": name,
            "R2": r2,
            "MAE": mae,
            "RMSE": rmse
        })

        # 📈 Actual vs Predicted Plot
        plt.scatter(y_test, preds)
        plt.xlabel("Actual")
        plt.ylabel("Predicted")
        plt.title(f"{name} - Actual vs Predicted")
        plt.savefig(f"reports/figures/{name}_actual_vs_predicted.png")
        plt.close()

    # ✅ Create comparison DataFrame
    results_df = pd.DataFrame(results)
    print("\n📊 Model Comparison:\n", results_df)

    # 📊 Bar Plot for R2 Comparison
    plt.figure()
    plt.bar(results_df["Model"], results_df["R2"])
    plt.title("Model Comparison (R2 Score)")
    plt.savefig("reports/figures/model_comparison.png")
    plt.close()

    # 💾 Save results
    results_df.to_csv("reports/model_comparison.csv", index=False)

    # 📝 Save report
    with open("reports/model_report.md", "w") as f:
        f.write("# Model Evaluation Report\n\n")
        f.write(results_df.to_string(index=False))

    print("\n✅ Evaluation completed. Reports saved in 'reports/' folder.")

if __name__ == "__main__":
    evaluate()