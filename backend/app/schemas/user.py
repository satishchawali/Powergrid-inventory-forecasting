from pydantic import BaseModel, EmailStr, Field

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    username: str
    password: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str
    email: str
    full_name: str

class UserProfileResponse(BaseModel):
    full_name: str
    email: EmailStr
    role: str

    class Config:
        orm_mode = True

class UserProfileUpdate(BaseModel):
    full_name: str
    email: EmailStr

class changePassword(BaseModel):
    old_password: str
    new_password: str

