from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class InventoryItem(Base):
    __tablename__ = "inventory_items"

    item_id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String(150), nullable=False)
    equipment_rating = Column(String(50))
    voltage_level = Column(String(50))
    unit = Column(String(20))
    reorder_level = Column(Integer)

class InventoryStock(Base):
    __tablename__ = "inventory_stock"

    stock_id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("inventory_items.item_id"))
    location = Column(String(100))
    quantity_available = Column(Integer)
    last_updated = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    item = relationship("InventoryItem")
