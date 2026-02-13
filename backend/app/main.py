from app.routes import forecast, auth, dashboard, inventory, settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Power Grid Inventory Forecasting")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forecast.router)
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(inventory.router)
app.include_router(settings.router)

@app.get("/")
def home():
    return {"message": "Power Grid Inventory Forecasting API Running"}
