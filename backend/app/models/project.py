from sqlalchemy import Column, Integer, String, Date, Enum
from app.database import Base
import enum

class ProjectStatus(str, enum.Enum):
    PLANNED = "PLANNED"
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"
    DELAYED = "DELAYED"

class PowerProject(Base):
    __tablename__ = "power_projects"

    project_id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String(150), nullable=False)
    project_type = Column(String(50))
    region = Column(String(50))
    start_date = Column(Date)
    expected_end_date = Column(Date)
    project_status = Column(Enum(ProjectStatus))
