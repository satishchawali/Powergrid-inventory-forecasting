from sqlalchemy import Column, Integer, Date, Enum, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class RiskLevel(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class DemandForecast(Base):
    __tablename__ = "demand_forecast"

    forecast_id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("inventory_items.item_id"))
    project_id = Column(Integer, ForeignKey("power_projects.project_id"))
    forecast_month = Column(Date)
    predicted_quantity = Column(Integer)
    risk_level = Column(Enum(RiskLevel))
    created_at = Column(TIMESTAMP, server_default=func.now())

    item = relationship("InventoryItem")
    project = relationship("PowerProject")
