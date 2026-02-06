from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.report import Report

router = APIRouter(prefix="/reports", tags=["Reports"])

REPORT_TYPES = [
    {"id": "inv_sum", "name": "Inventory Summary", "description": "Complete overview of current stock levels across all locations."},
    {"id": "dem_for", "name": "Demand Forecast", "description": "AI-projected material requirements for upcoming periods."},
    {"id": "low_stock", "name": "Low Stock Alerts", "description": "Detailed list of items currently below critical threshold."},
    {"id": "sup_perf", "name": "Supplier Performance", "description": "Analysis of delivery times and material quality by supplier."}
]

@router.get("/")
def get_reports(db: Session = Depends(get_db)):
    reports = db.query(Report).order_by(Report.id.desc()).all()
    return reports

@router.get("/types")
def get_report_types():
    return REPORT_TYPES

@router.post("/generate")
def generate_report(type_id: str, title: Optional[str] = None, db: Session = Depends(get_db)):
    # Find the type meta
    type_meta = next((t for t in REPORT_TYPES if t["id"] == type_id), None)
    if not type_meta:
        raise HTTPException(status_code=400, detail="Invalid report type")
    
    new_report = Report(
        title=title or f"{type_meta['name']} - {datetime.now().strftime('%b %d, %Y')}",
        type=type_meta["name"],
        format="PDF",
        status="Generating",
        size="Pending"
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    return new_report

@router.get("/{report_id}/status")
def get_report_status(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Simulate completion if it was generating
    if report.status == "Generating":
        report.status = "Completed"
        report.size = "1.2 MB"
        db.commit()
        db.refresh(report)
        
    return report
