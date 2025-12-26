import joblib
import numpy as np

# Load model once (IMPORTANT)
model = joblib.load("C:/satcode/latest/Final_year/Powergrid-inventory-forecasting/ml/inventory_forecast_model.pkl")

def predict_demand(day: int):
    prediction = model.predict(np.array([[day]]))
    return round(prediction[0], 2)
