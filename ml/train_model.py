import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib

# Load data
data = pd.read_csv("data/inventory_usage.csv")

data["day"] = range(len(data))
X = data[["day"]]
y = data["usage"]

# Train model
model = LinearRegression()
model.fit(X, y)

# Save model
joblib.dump(model, "inventory_forecast_model.pkl")

print("✅ Model trained & saved successfully")
