from pydantic import BaseModel, EmailStr, constr, ConfigDict
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    username: constr(min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str]
    role: str

class UserCreate(UserBase):
    password: constr(min_length=6)

class UserRead(UserBase):
    id: int
    is_active: bool
    registration_status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
