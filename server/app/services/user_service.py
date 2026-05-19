"""Database operations for the User resource (excluding auth flows)."""

from fastapi import HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session

from .. import models, schemas
from ..core.security import hash_password


def _ensure_unique(db: Session, username: str, email: str) -> None:
    """Reject username/email already taken by another row."""
    existing = (
        db.query(models.User)
        .filter(or_(models.User.username == username, models.User.email == email))
        .first()
    )
    if existing:
        if existing.username == username:
            raise HTTPException(status_code=400, detail="Username already exists")
        raise HTTPException(status_code=400, detail="Email already registered")


def register_user(db: Session, payload: schemas.UserCreate) -> models.User:
    """Public self-service registration — role is always "user"."""
    _ensure_unique(db, payload.username, payload.email)

    user = models.User(
        username=payload.username,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role="user",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_user_as_admin(db: Session, payload: schemas.AdminCreate) -> models.User:
    """Admin-driven creation: role can be set explicitly."""
    _ensure_unique(db, payload.username, payload.email)

    user = models.User(
        username=payload.username,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def list_users(db: Session) -> list[models.User]:
    return db.query(models.User).all()


def update_user_as_admin(
    db: Session, user_id: int, payload: schemas.AdminUpdate
) -> models.User:
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.username is not None:
        user.username = payload.username
    if payload.email is not None:
        user.email = payload.email
    if payload.password is not None:
        user.password_hash = hash_password(payload.password)
    if payload.role is not None:
        user.role = payload.role

    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user_id: int) -> dict:
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Admins cannot be removed via the admin panel — protects against lockout.
    if user.role == "admin":
        raise HTTPException(status_code=403, detail="Cannot delete admin users")

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}
