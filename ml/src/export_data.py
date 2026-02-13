import pandas as pd
from sqlalchemy import create_engine
import os
import numpy as np

def export_current_data():
    # DB connection
    engine = create_engine(
        "mysql+pymysql://root:root@localhost:3306/powergrid_inventory"
    )

    # SQL query to get base demand data
    query = """
    SELECT
        ii.name as material_id,
        year(dh.demand_date) as year,
        month(dh.demand_date) as month,
        SUM(dh.quantity_used) as historical_demand,
        COUNT(DISTINCT dh.project_id) as project_count
    FROM demand_history dh
    JOIN inventory_items ii ON dh.item_id = ii.item_id
    GROUP BY ii.name, year(dh.demand_date), month(dh.demand_date);
    """

    df = pd.DataFrame()
    try:
        # Load data
        df = pd.read_sql(query, engine)
    except Exception as e:
        print(f"Warning: Database read failed ({e}). Using mock data.")

    if df.empty:
        print("Using generated mock data for demonstration.")
        # Mock data if DB is empty or failed
        df = pd.DataFrame({
            "material_id": ["ACSR_CONDUCTOR"] * 6,
            "year": [2024] * 6,
            "month": range(1, 7),
            "historical_demand": [180, 195, 210, 225, 240, 260],
            "project_count": [3, 3, 4, 4, 5, 5]
        })

    # Feature Enrichment (Mocking missing DB columns for now)
    df["avg_consumption_rate"] = df["historical_demand"] / 30
    df["current_stock"] = np.random.randint(1000, 5000, size=len(df)) # Mock stock history
    df["lead_time_days"] = 45 # Mock lead time
    
    def get_season(m):
        if m in [12, 1, 2]: return "WINTER"
        elif m in [3, 4, 5]: return "SUMMER"
        else: return "MONSOON"
        
    df["season"] = df["month"].apply(get_season)
    df["weather_index"] = np.random.uniform(0, 1, size=len(df))

    # Ensure folder exists (Absolute path)
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # ml/
    output_dir = os.path.join(base_dir, "data", "raw")
    os.makedirs(output_dir, exist_ok=True)

    # Save to CSV
    output_file = os.path.join(output_dir, "material_realtime_raw.csv")
    df.to_csv(output_file, index=False)

    print(f"Data exported successfully to {output_file}")

if __name__ == "__main__":
    export_current_data()
