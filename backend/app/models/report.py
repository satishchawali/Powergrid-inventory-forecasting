from sqlalchemy import Column, Integer, String, Date
from app.database import Base
from datetime import datetime

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    type = Column(String(100), nullable=True) # e.g., Inventory Summary
    format = Column(String(20), default="PDF")
    status = Column(String(50), default="Completed") # Completed, Generating, Failed
    size = Column(String(50), nullable=True)
    created_at = Column(Date, default=datetime.now().date)
