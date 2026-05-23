from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
    """Self-service registration payload (role is forced to "user" server-side)."""

    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserUpdate(BaseModel):
    """Self-service profile update (cannot change role)."""

    username: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role: str

    class Config:
        from_attributes = True


class AdminCreate(BaseModel):
    """Admin-only: create a user with an explicit role."""

    username: str
    email: str
    password: str
    role: str = "user"


class AdminUpdate(BaseModel):
    """Admin-only: any field including role may be updated."""

    username: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
