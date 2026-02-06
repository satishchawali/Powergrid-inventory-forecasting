from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.auth_utils import verify_password, get_password_hash

def get_user_profile(db: Session, user_id: int):
    return (
        db.query(User)
        .filter(User.user_id == user_id)
        .first()
    )

def update_user_profile(db: Session, user_id: int, data):
    user = db.query(User).filter(User.user_id == user_id).first()
    if user:
        user.full_name = data.full_name
        user.email = data.email
        db.commit()
        db.refresh(user)
    return user

def change_user_password(db: Session, user_id: int, old_password: str, new_password: str):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(old_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Old password is incorrect")

    user.password_hash = get_password_hash(new_password)
    db.commit()
