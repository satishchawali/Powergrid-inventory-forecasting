from app.database import engine, Base
# Import all models so they are registered with Base metadata
from app.models.user import User
from app.models.project import PowerProject
from app.models.inventory import InventoryItem, InventoryStock
from app.models.operations import ProjectInventoryRequirement, DemandHistory, MaintenanceRecord
from app.models.forecast import DemandForecast

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

if __name__ == "__main__":
    init_db()
