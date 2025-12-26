import joblib
import numpy as np

# Load model once (IMPORTANT)
model = joblib.load("D:\Projects\Final_year_project\Powergrid-inventory-forecasting\ml\inventory_forecast_model.pkl")

def predict_demand(day: int):
    prediction = model.predict(np.array([[day]]))
    return round(prediction[0], 2)
