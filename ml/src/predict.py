import joblib
import pandas as pd
from config import MODEL_PATH

def predict_demand(input_dict):
    model = joblib.load(MODEL_PATH)
    df = pd.DataFrame([input_dict])
    prediction = model.predict(df)
    return round(prediction[0], 2)

# Example test
if __name__ == "__main__":
    sample = {
        "material_id": 0,
        "month": 7,
        "year": 2024,
        "historical_demand": 300,
        "avg_consumption_rate": 10,
        "current_stock": 1200,
        "lead_time_days": 45,
        "project_count": 5,
        "season": 1,
        "weather_index": 0.8,
        "demand_lag_1": 290,
        "stock_coverage_days": 120,
        "lead_time_risk": 450
    }

    print("Predicted Demand:", predict_demand(sample))
