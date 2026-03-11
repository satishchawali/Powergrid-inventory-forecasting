import pandas as pd
import numpy as np
import random

def generate_data(num_records=100000):
    regions = ['Maharashtra', 'Tamil Nadu', 'Delhi', 'Karnataka', 'Gujarat', 'Bihar', 'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Madhya Pradesh']
    tower_types = ['Transmission', 'Distribution', 'Substation']
    materials = [
        'Power Transformer 220kV', 'Copper Cable 400mm', 'Circuit Breaker', 
        'Insulator Disc', 'Steel Tower', 'Earthing Rod', 'Relay Panel', 
        'High Voltage Fuse', 'Galvanized Steel Wire', 'ACSR Conductor'
    ]
    
    data = []
    print(f"Generating {num_records} records...")
    for i in range(num_records):
        budget = random.randint(5000000, 13000000) # Sync with DB range
        region = random.choice(regions)
        tower_type = random.choice(tower_types)
        month = random.randint(1, 12)
        year = random.choice([2024, 2025])
        weather_index = round(random.uniform(0.3, 0.9), 2)
        lead_time = random.randint(10, 30)
        material = random.choice(materials)
        
        # Consistent proportional logic for quantity
        base_qty = budget / 1000000
        if 'Cable' in material or 'Wire' in material or 'Conductor' in material:
            quantity = int(base_qty * random.randint(100, 280))
        elif 'Disc' in material or 'Rod' in material:
            quantity = int(base_qty * random.randint(30, 70))
        elif 'Tower' in material:
            quantity = int(base_qty * random.randint(2, 6))
        else: # Transformers, breakers, etc.
            quantity = int(max(1, base_qty * random.uniform(0.3, 1.2)))
            
        data.append([budget, region, tower_type, month, year, weather_index, lead_time, material, quantity])
        
        if (i+1) % 25000 == 0:
            print(f"Progress: {i+1}/{num_records}")
    
    df = pd.DataFrame(data, columns=['project_budget', 'region', 'tower_type', 'month', 'year', 'weather_index', 'lead_time_days', 'material_name', 'quantity'])
    
    # Ensure directory exists and use robust path
    save_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'raw', 'material_forecast_dataset.csv')
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    
    df.to_csv(save_path, index=False)
    print(f"Successfully generated {num_records} records in {save_path}")

if __name__ == "__main__":
    import os
    generate_data(100000)
