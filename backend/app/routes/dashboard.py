from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.inventory import InventoryItem, InventoryStock

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/")
def get_dashboard(db: Session = Depends(get_db)):

    # 1️⃣ Total materials
    total_materials = db.query(InventoryItem).count()

    # 2️⃣ Low stock items (ANY location below threshold)
    low_stock_items = (
        db.query(InventoryStock)
        .join(InventoryItem, InventoryStock.item_id == InventoryItem.item_id)
        .filter(InventoryStock.quantity_available < InventoryItem.threshold)
        .count()
    )

    # 3️⃣ Material status list (limit for dashboard)
    results = (
        db.query(InventoryItem, InventoryStock)
        .join(InventoryStock, InventoryItem.item_id == InventoryStock.item_id)
        .limit(5)
        .all()
    )

    materials = []
    for item, stock in results:
        materials.append({
            "name": item.name,
            "category": item.category,
            "quantity": f"{stock.quantity_available} {item.unit}",
            "status": (
                "Low Stock"
                if stock.quantity_available < item.threshold
                else "In Stock"
            )
        })

    # 4️⃣ Reports (can be DB later)
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
