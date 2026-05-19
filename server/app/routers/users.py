from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .. import models, schemas
from ..core.security import (
    create_access_token,
    get_current_user,
    require_admin,
    verify_password,
)
from ..database import get_db
from ..services import user_service

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/register", response_model=schemas.UserOut)
def register_user(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    return user_service.register_user(db, payload)


@router.post("/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = (
        db.query(models.User)
        .filter(models.User.username == form_data.username)
        .first()
    )
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token(
        {"user_id": user.id, "username": user.username, "role": user.role}
    )
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@router.get("/", response_model=list[schemas.UserOut])
def get_users(
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    return user_service.list_users(db)


@router.post("/", response_model=schemas.UserOut)
def create_user_admin(
    payload: schemas.AdminCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    return user_service.create_user_as_admin(db, payload)


@router.put("/{user_id}", response_model=schemas.UserOut)
def update_user(
    user_id: int,
    payload: schemas.AdminUpdate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    return user_service.update_user_as_admin(db, user_id, payload)


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    return user_service.delete_user(db, user_id)
