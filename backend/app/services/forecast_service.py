import os
import joblib
import numpy as np

# Load model dynamically
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
MODEL_PATH = os.path.join(BASE_DIR, "ml", "inventory_forecast_model.pkl")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}")

model = joblib.load(MODEL_PATH)

def predict_demand(day: int):
    prediction = model.predict(np.array([[day]]))
    return round(prediction[0], 2)
