import os
import joblib
import numpy as np
import pandas as pd

# Load model dynamically
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
MODEL_PATH = os.path.join(BASE_DIR, "ml/models", "material_model.pkl")

model = None
try:
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
except Exception as e:
    print(f"Error loading model: {e}")

def get_season(month):
    if month in [12, 1, 2]:
        return "Winter"
    elif month in [3, 4, 5]:
        return "Summer"
    else:
        return "Monsoon"

def get_budget_category(budget):
    if budget <= 5000000:
        return "Low"
    elif budget <= 20000000:
        return "Medium"
    else:
        return "High"

def predict_demand(project_budget, region, tower_type, material_name, month, year, weather_index=0.5, lead_time_days=15):
    if model is None:
        # Fallback if model not loaded
        return 1500.0
    
    import pandas as pd
    
    season = get_season(month)
    budget_category = get_budget_category(project_budget)
    
    input_data = pd.DataFrame([{
        "project_budget": project_budget,
        "region": region,
        "tower_type": tower_type,
        "month": month,
        "year": year,
        "weather_index": weather_index,
        "lead_time_days": lead_time_days,
        "material_name": material_name,
        "season": season,
        "budget_category": budget_category
    }])
    
    prediction = model.predict(input_data)
    return float(prediction[0])
