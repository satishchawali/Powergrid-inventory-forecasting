from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.inventory import InventoryItem

router = APIRouter(prefix="/inventory", tags=["Inventory"])

@router.get("/")
def get_inventory(db: Session = Depends(get_db)):
    items = db.query(InventoryItem).all()

    return [    
        {
            "item_id": item.item_id,
            "name": item.name,
            "category": item.category,
            "quantity": item.quantity,
            "unit": item.unit,
            "threshold": item.threshold,
            "status": "Low Stock" if item.quantity < item.threshold else "In Stock"
        }
        for item in items
    ]
