from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.inventory import InventoryItem

router = APIRouter(prefix="/inventory", tags=["Inventory"])

@router.get("/")
def get_inventory(
    page: int = 1, 
    page_size: int = 50, 
    search: str = None, 
    db: Session = Depends(get_db)
):
    query = db.query(InventoryItem)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (InventoryItem.name.ilike(search_filter)) |
            (InventoryItem.category.ilike(search_filter))
        )
    
    total = query.count()
    skip = (page - 1) * page_size
    items = query.offset(skip).limit(page_size).all()

    # Get absolute counts for the header stats (independant of current search/page)
    all_items_count = db.query(InventoryItem).count()
    all_low_stock = db.query(InventoryItem).filter(InventoryItem.quantity < InventoryItem.threshold).count()

    return {
        "items": [
            {
                "item_id": item.item_id,
                "name": item.name,
                "category": item.category,
                "quantity": item.quantity,
                "unit": item.unit,
                "threshold": item.threshold,
                "status": "Critical" if item.quantity < item.threshold else "Sufficient"
            }
            for item in items
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_all": all_items_count,
        "low_stock_all": all_low_stock
    }
