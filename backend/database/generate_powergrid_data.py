import random
from faker import Faker
import mysql.connector
from tqdm import tqdm
from datetime import timedelta

fake = Faker()

# =============================
# DATABASE CONNECTION
# =============================

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="powergrid_inventory"
)

cursor = conn.cursor()

# =============================
# CONFIGURATION
# =============================

NUM_PROJECTS = 1000
NUM_ITEMS = 500
NUM_STOCK = 10000
NUM_REQUIREMENTS = 20000
NUM_DEMAND_HISTORY = 20000
NUM_MAINTENANCE = 10000
NUM_FORECAST = 10000
NUM_REPORTS = 1000

# =============================
# PROJECT TYPES
# =============================

project_types = ["Transmission", "Substation"]

project_statuses = ["PLANNED","ONGOING","COMPLETED","DELAYED"]

regions = [
    "Maharashtra","Delhi","Tamil Nadu","West Bengal","Rajasthan",
    "Uttar Pradesh","Gujarat","Bihar","Karnataka","Madhya Pradesh"
]

# =============================
# ITEM DATA
# =============================

item_names = [
    "Power Transformer 220kV",
    "Copper Cable 400mm",
    "Circuit Breaker",
    "Insulator String",
    "Control Panel",
    "Galvanized Steel Wire",
    "ACSR Conductor",
    "Relay Panel",
    "Earthing Rod",
    "High Voltage Fuse",
    "Steel Tower",
    "Insulator Disc"
]

categories = [
    "Transformer",
    "Cable",
    "Switchgear",
    "Hardware",
    "Control System",
    "Protection",
    "Structure",
    "Equipment"
]

units = ["Units","Meters","Kg"]

failure_types = [
    "Overheating",
    "Mechanical Failure",
    "Corrosion",
    "Voltage Issue",
    "Insulation Damage",
    "Calibration Fault"
]

risk_levels = ["LOW","MEDIUM","HIGH"]

# =============================
# GENERATE PROJECTS
# =============================

print("Generating projects...")

for _ in tqdm(range(NUM_PROJECTS)):

    start = fake.date_between("-3y", "today")
    end = start + timedelta(days=random.randint(200,900))

    cursor.execute("""
        INSERT INTO power_projects
        (project_name, project_type, region, start_date, expected_end_date, project_status, project_budget)
        VALUES (%s,%s,%s,%s,%s,%s,%s)
    """,(
        fake.company() + " Power Project",
        random.choice(project_types),
        random.choice(regions),
        start,
        end,
        random.choice(project_statuses),
        random.uniform(5000000, 13000000) # 50 Lakhs to 1.3 Crores
    ))

conn.commit()

# =============================
# GENERATE INVENTORY ITEMS
# =============================

print("Generating items...")

for _ in tqdm(range(NUM_ITEMS)):

    cursor.execute("""
        INSERT INTO inventory_items
        (name, category, quantity, unit, threshold)
        VALUES (%s,%s,%s,%s,%s)
    """,(
        random.choice(item_names),
        random.choice(categories),
        random.randint(100,10000),
        random.choice(units),
        random.randint(10,200)
    ))

conn.commit()

# =============================
# FETCH IDS
# =============================

cursor.execute("SELECT project_id FROM power_projects")
project_ids = [x[0] for x in cursor.fetchall()]

cursor.execute("SELECT item_id FROM inventory_items")
item_ids = [x[0] for x in cursor.fetchall()]

# =============================
# INVENTORY STOCK
# =============================

print("Generating stock...")

for _ in tqdm(range(NUM_STOCK)):

    cursor.execute("""
        INSERT INTO inventory_stock
        (item_id, location, quantity_available)
        VALUES (%s,%s,%s)
    """,(
        random.choice(item_ids),
        fake.city() + " Warehouse",
        random.randint(50,3600)
    ))

conn.commit()

# =============================
# PROJECT REQUIREMENTS
# =============================

print("Generating requirements...")

for _ in tqdm(range(NUM_REQUIREMENTS)):

    cursor.execute("""
        INSERT INTO project_inventory_requirement
        (project_id, item_id, required_quantity, required_by_date)
        VALUES (%s,%s,%s,%s)
    """,(
        random.choice(project_ids),
        random.choice(item_ids),
        random.randint(1,3600),
        fake.date_between("-1y","+1y")
    ))

conn.commit()

# =============================
# DEMAND HISTORY
# =============================

print("Generating demand history...")

for _ in tqdm(range(NUM_DEMAND_HISTORY)):

    cursor.execute("""
        INSERT INTO demand_history
        (item_id, project_id, demand_date, quantity_used)
        VALUES (%s,%s,%s,%s)
    """,(
        random.choice(item_ids),
        random.choice(project_ids),
        fake.date_between("-3y","today"),
        random.randint(1,3600)
    ))

conn.commit()

# =============================
# MAINTENANCE
# =============================

print("Generating maintenance records...")

for _ in tqdm(range(NUM_MAINTENANCE)):

    cursor.execute("""
        INSERT INTO maintenance_records
        (item_id, maintenance_date, failure_type, downtime_hours)
        VALUES (%s,%s,%s,%s)
    """,(
        random.choice(item_ids),
        fake.date_between("-3y","today"),
        random.choice(failure_types),
        random.randint(1,72)
    ))

conn.commit()

# =============================
# FORECAST
# =============================

print("Generating forecast...")

for _ in tqdm(range(NUM_FORECAST)):

    cursor.execute("""
        INSERT INTO demand_forecast
        (item_id, project_id, forecast_month, predicted_quantity, risk_level)
        VALUES (%s,%s,%s,%s,%s)
    """,(
        random.choice(item_ids),
        random.choice(project_ids),
        fake.date_between("today","+2y"),
        random.randint(20,6000),
        random.choice(risk_levels)
    ))

conn.commit()

# =============================
# REPORTS
# =============================

print("Generating reports...")

for _ in tqdm(range(NUM_REPORTS)):

    cursor.execute("""
        INSERT INTO reports
        (title, status, created_at)
        VALUES (%s,%s,%s)
    """,(
        fake.catch_phrase(),
        random.choice(["Generated","Pending"]),
        fake.date_between("-2y","today")
    ))

conn.commit()

cursor.close()
conn.close()

print("✅ DATA GENERATION COMPLETE")