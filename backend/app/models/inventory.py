from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class InventoryItem(Base):
    __tablename__ = "inventory_items"

    item_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    category = Column(String(100), nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String(20), nullable=False)
    threshold = Column(Float, nullable=False)

    stocks = relationship("InventoryStock", back_populates="item")

class InventoryStock(Base):
    __tablename__ = "inventory_stock"

    stock_id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("inventory_items.item_id"))
    location = Column(String(100))
    quantity_available = Column(Integer)
    last_updated = Column(
        TIMESTAMP,
        server_default=func.now(),
        onupdate=func.now()
    )

    item = relationship("InventoryItem", back_populates="stocks")
