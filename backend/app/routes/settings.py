from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.user import UserProfileResponse, UserProfileUpdate
from app.database import get_db
from app.services.user_service import get_user_profile, update_user_profile
from app.auth_utils import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/settings",
    tags=["Settings"]
)

@router.get("/profile", response_model=UserProfileResponse)
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_profile(db, current_user.user_id)

@router.put("/profile", response_model=UserProfileResponse)
def update_profile(
    data: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_user_profile(db, current_user.user_id, data)
