from sqlalchemy import Column, Integer, Date, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class ProjectInventoryRequirement(Base):
    __tablename__ = "project_inventory_requirement"

    requirement_id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("power_projects.project_id"))
    item_id = Column(Integer, ForeignKey("inventory_items.item_id"))
    required_quantity = Column(Integer)
    required_by_date = Column(Date)

    project = relationship("PowerProject")
    item = relationship("InventoryItem")

class DemandHistory(Base):
    __tablename__ = "demand_history"

    demand_id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("inventory_items.item_id"))
    project_id = Column(Integer, ForeignKey("power_projects.project_id"))
    demand_date = Column(Date)
    quantity_used = Column(Integer)

    item = relationship("InventoryItem")
    project = relationship("PowerProject")

class MaintenanceRecord(Base):
    __tablename__ = "maintenance_records"

    maintenance_id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("inventory_items.item_id"))
    maintenance_date = Column(Date)
    failure_type = Column(String(100))
    downtime_hours = Column(Integer)

    item = relationship("InventoryItem")
