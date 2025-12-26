from fastapi import APIRouter
from app.services.forecast_service import predict_demand

router = APIRouter()

@router.get("/forecast")
def forecast(day: int = 5):
    demand = predict_demand(day)
    return {
        "item": "Transformer",
        "day": day,
        "forecasted_demand": demand,
        "unit": "units"
    }
