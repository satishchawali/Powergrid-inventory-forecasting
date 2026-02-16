from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.inventory import InventoryItem, InventoryStock

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/")
def get_dashboard(db: Session = Depends(get_db)):

    total_materials = db.query(InventoryItem).count()

    low_stock_items = (
        db.query(InventoryItem)
        .filter(InventoryItem.quantity < InventoryItem.threshold)
        .count()
    )

    results = (
        db.query(InventoryItem)
        .limit(5)
        .all()
    )

    materials = []
    for item in results:
        materials.append({
            "name": item.name,
            "category": item.category,
            "quantity": f"{item.quantity} {item.unit}",
            "status": (
                "Critical"
                if item.quantity < item.threshold
                else "Sufficient"
            )
        })

    reports = [
        {
            "title": "Inventory Status Report",
            "status": "Completed",
            "date": "2024-01-15"
        }
    ]

    return {
        "total_materials": total_materials,
        "low_stock_items": low_stock_items,
        "recent_reports": len(reports),
        "system_status": "Online",
        "materials": materials,
        "reports": reports
    }
