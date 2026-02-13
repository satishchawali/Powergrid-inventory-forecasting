# Powergrid-inventory-forecasting
# Material Demand Forecasting

## 📌 Project Overview
This project predicts material demand for power grid infrastructure using machine learning.

## 📊 Dataset
The dataset contains:
- Project budget
- Region
- Tower type
- Weather index
- Lead time
- Historical demand
- Material type

Target variable:
- Quantity of material required

## ⚙ Setup Instructions

1. Clone repository
2. Install dependencies:

pip install -r requirements.txt

3. Place dataset inside:

data/raw/material_forecast_dataset.csv

4. Run full pipeline:

python run_pipeline.py

## 🤖 Models Used

- Random Forest Regressor
- Gradient Boosting Regressor

Best model automatically selected based on R² score.

## 📈 Evaluation Metrics

- R² Score
- Mean Absolute Error (MAE)
- Root Mean Squared Error (RMSE)

Evaluation results saved in:
reports/model_report.md

## 🔍 Key Findings

- Project budget strongly influences material demand.
- Seasonal variation impacts hardware components.
- Lead time affects safety stock levels.

## 🚧 Limitations

- Dataset size limited
- No real-time external weather API
- No time-series modeling (future improvement)

## 🚀 Future Improvements

- LSTM time-series model
- Hyperparameter tuning
- Streamlit dashboard
- Deployment with FastAPI
