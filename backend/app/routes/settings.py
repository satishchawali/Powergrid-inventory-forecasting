from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.user import UserProfileResponse, UserProfileUpdate, changePassword
from app.database import get_db
from app.services.user_service import get_user_profile, update_user_profile, change_user_password
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

@router.put("/profile", response_model=UserProfileUpdate)
def update_profile(
    data: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_user_profile(db, current_user.user_id, data)


@router.put("/change-password")
def change_user_password_route(
    payload: changePassword,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    change_user_password(db, current_user.user_id, payload.old_password, payload.new_password)
    return {"message": "Password updated successfully"}
