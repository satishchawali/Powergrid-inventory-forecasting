import pandas as pd
import joblib
import matplotlib.pyplot as plt
import os
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

def evaluate():

    df = pd.read_csv("data/processed/material_forecast_cleaned.csv")

    X = df.drop("quantity", axis=1)
    y = df["quantity"]

    model = joblib.load("models/material_model.pkl")

    preds = model.predict(X)

    r2 = r2_score(y, preds)
    mae = mean_absolute_error(y, preds)
    rmse = np.sqrt(mean_squared_error(y, preds))

    print("R2:", r2)
    print("MAE:", mae)
    print("RMSE:", rmse)

    os.makedirs("reports/figures", exist_ok=True)

    # Plot
    plt.scatter(y, preds)
    plt.xlabel("Actual")
    plt.ylabel("Predicted")
    plt.title("Actual vs Predicted")
    plt.savefig("reports/figures/actual_vs_predicted.png")
    plt.close()

    # Save report
    with open("reports/model_report.md", "w") as f:
        f.write(f"# Model Evaluation Report\n\n")
        f.write(f"R2 Score: {r2}\n")
        f.write(f"MAE: {mae}\n")
        f.write(f"RMSE: {rmse}\n")

    print("Evaluation completed.")

if __name__ == "__main__":
    evaluate()
