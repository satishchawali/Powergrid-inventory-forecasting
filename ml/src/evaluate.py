import pandas as pd
import joblib
from sklearn.metrics import mean_absolute_error, r2_score
from config import PROCESSED_DATA_PATH, MODEL_PATH

def evaluate():
    df = pd.read_csv(PROCESSED_DATA_PATH)

    X = df.drop("target_demand", axis=1)
    y = df["target_demand"]

    model = joblib.load(MODEL_PATH)
    preds = model.predict(X)

    print("MAE:", mean_absolute_error(y, preds))
    print("R2 Score:", r2_score(y, preds))

if __name__ == "__main__":
    evaluate()
