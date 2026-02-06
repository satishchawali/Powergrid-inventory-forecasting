from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin, Token, UserProfileResponse, UserProfileUpdate, changePassword
from app.auth_utils import get_password_hash, verify_password, create_access_token, decode_token,oauth2_scheme

router = APIRouter(prefix="/auth", tags=["auth"])

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(
        (User.username == user_data.username) | (User.email == user_data.email)
    ).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    # Create new user
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        full_name=user_data.full_name,
        password_hash=get_password_hash(user_data.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User registered successfully"}

@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    # Find user by username
    user = db.query(User).filter(User.username == user_data.username).first()
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login time
    from sqlalchemy.sql import func
    user.last_login_at = func.now()
    db.commit()
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.user_id)})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "username": user.username,
        "email": user.email
    }

def get_current_user_id(token: str = Depends(oauth2_scheme)):
    user_id = decode_token(token)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    return int(user_id)


# ---------------- PROFILE ----------------
@router.get("/profile", response_model=UserProfileResponse)
def get_profile(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
   user = db.query(User).filter(User.user_id == user_id).first()
   return user

@router.put("/profile", response_model=UserProfileUpdate)
def update_user_profile(
    payload: UserProfileUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    return update_profile(db, user_id, payload.full_name, payload.email)

# ---------------- PASSWORD ----------------
@router.put("/change-password")
def change_user_password(
    payload: changePassword,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    change_password(db, user_id, payload.old_password, payload.new_password)
    return {"message": "Password updated successfully"}
