import sys
import os

# Ensure app is in python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database import engine, Base
from app.models import User, PowerProject, InventoryItem, InventoryStock, ProjectInventoryRequirement, DemandHistory, MaintenanceRecord, DemandForecast

def test_connection():
    try:
        connection = engine.connect()
        print("✅ Database connection successful!")
        connection.close()
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return

    print("🔄 Ensuring tables exist...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created/verified successfully!")
    except Exception as e:
        print(f"❌ Table creation failed: {e}")

if __name__ == "__main__":
    test_connection()
