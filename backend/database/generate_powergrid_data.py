import random
from faker import Faker
import mysql.connector
from tqdm import tqdm
from datetime import datetime, timedelta

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
# CONFIGURATION (CHANGE SIZE)
# =============================

# NUM_USERS = 5000
NUM_PROJECTS = 20000
NUM_ITEMS = 4000
NUM_STOCK = 100000
NUM_REQUIREMENTS = 200000
NUM_DEMAND_HISTORY = 400000
NUM_MAINTENANCE = 160000
NUM_FORECAST = 300000
NUM_REPORTS = 20000

# =============================
# USERS
# =============================

# print("Generating users...")

# for _ in tqdm(range(NUM_USERS)):

#     cursor.execute("""
#     INSERT INTO users
#     (full_name, username, email, password_hash, role, is_active)
#     VALUES (%s, %s, %s, %s, %s, %s)
#     """, (
#         fake.name(),
#         fake.user_name() + str(random.randint(1, 999999)),
#         fake.email(),
#         fake.sha256(),
#         "ADMIN",
#         True
#     ))

# conn.commit()


# =============================
# POWER PROJECTS
# =============================

print("Generating projects...")

project_ids = []

for _ in tqdm(range(NUM_PROJECTS)):

    start = fake.date_between("-3y", "+1y")
    end = start + timedelta(days=random.randint(180, 900))

    cursor.execute("""
    INSERT INTO power_projects
    (project_name, project_type, region, start_date, expected_end_date, project_status)
    VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        fake.company() + " Power Project",
        random.choice(["Transmission", "Substation"]),
        fake.state(),
        start,
        end,
        random.choice(["PLANNED","ONGOING","COMPLETED","DELAYED"])
    ))

conn.commit()


# =============================
# INVENTORY ITEMS
# =============================

print("Generating inventory items...")

for _ in tqdm(range(NUM_ITEMS)):

    cursor.execute("""
    INSERT INTO inventory_items
    (name, category, quantity, unit, threshold)
    VALUES (%s, %s, %s, %s, %s)
    """, (
        fake.word().capitalize() + " Equipment",
        random.choice(["Transformer","Cable","Hardware","Switchgear"]),
        random.randint(100, 10000),
        random.choice(["Units","Meters","Kg"]),
        random.randint(10, 200)
    ))

conn.commit()


# Get IDs
cursor.execute("SELECT project_id FROM power_projects")
project_ids = [x[0] for x in cursor.fetchall()]

cursor.execute("SELECT item_id FROM inventory_items")
item_ids = [x[0] for x in cursor.fetchall()]


# =============================
# INVENTORY STOCK
# =============================

print("Generating inventory stock...")

for _ in tqdm(range(NUM_STOCK)):

    cursor.execute("""
    INSERT INTO inventory_stock
    (item_id, location, quantity_available)
    VALUES (%s, %s, %s)
    """, (
        random.choice(item_ids),
        fake.city() + " Warehouse",
        random.randint(10, 5000)
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
    VALUES (%s, %s, %s, %s)
    """, (
        random.choice(project_ids),
        random.choice(item_ids),
        random.randint(10, 5000),
        fake.date_between("-1y", "+1y")
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
    VALUES (%s, %s, %s, %s)
    """, (
        random.choice(item_ids),
        random.choice(project_ids),
        fake.date_between("-3y", "today"),
        random.randint(5, 5000)
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
    VALUES (%s, %s, %s, %s)
    """, (
        random.choice(item_ids),
        fake.date_between("-3y", "today"),
        random.choice(["Overheating","Mechanical Failure","Corrosion","Voltage Issue"]),
        random.randint(1, 72)
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
    VALUES (%s, %s, %s, %s, %s)
    """, (
        random.choice(item_ids),
        random.choice(project_ids),
        fake.date_between("today", "+2y"),
        random.randint(10, 6000),
        random.choice(["LOW","MEDIUM","HIGH"])
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
    VALUES (%s, %s, %s)
    """, (
        fake.catch_phrase(),
        random.choice(["Generated","Pending"]),
        fake.date_between("-2y", "today")
    ))

conn.commit()


cursor.close()
conn.close()

print("DONE. Huge data generated.")
