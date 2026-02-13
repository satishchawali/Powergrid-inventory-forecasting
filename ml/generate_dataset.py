import pandas as pd
import numpy as np
import random

def generate_data(num_records=1000):
    regions = ['Maharashtra', 'Tamil Nadu', 'Delhi', 'Karnataka', 'Gujarat', 'Bihar', 'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Madhya Pradesh']
    tower_types = ['Transmission', 'Distribution', 'Substation']
    materials = [
        'Power Transformer 220kV', 'Copper Cable 400mm', 'Circuit Breaker', 
        'Insulator Disc', 'Steel Tower', 'Earthing Rod', 'Relay Panel', 
        'High Voltage Fuse', 'Galvanized Steel Wire', 'ACSR Conductor'
    ]
    
    data = []
    for _ in range(num_records):
        budget = random.randint(5000000, 25000000)
        region = random.choice(regions)
        tower_type = random.choice(tower_types)
        month = random.randint(1, 12)
        year = random.choice([2024, 2025])
        weather_index = round(random.uniform(0.3, 0.9), 2)
        lead_time = random.randint(10, 30)
        material = random.choice(materials)
        
        # Simple logic: higher budget usually means more quantity
        base_qty = budget / 1000000
        if 'Cable' in material or 'Wire' in material or 'Conductor' in material:
            quantity = int(base_qty * random.randint(150, 300))
        elif 'Disc' in material or 'Rod' in material:
            quantity = int(base_qty * random.randint(40, 60))
        elif 'Tower' in material:
            quantity = int(base_qty * random.randint(2, 5))
        else: # Transformers, breakers, etc.
            quantity = int(max(1, base_qty * random.uniform(0.3, 0.8)))
            
        data.append([budget, region, tower_type, month, year, weather_index, lead_time, material, quantity])
    
    df = pd.DataFrame(data, columns=['project_budget', 'region', 'tower_type', 'month', 'year', 'weather_index', 'lead_time_days', 'material_name', 'quantity'])
    df.to_csv('ml/data/raw/material_forecast_dataset.csv', index=False)
    print(f"Successfully generated {num_records} records in ml/data/raw/material_forecast_dataset.csv")

if __name__ == "__main__":
    generate_data(1000)
