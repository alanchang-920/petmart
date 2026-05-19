from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import schemas
from ..database import get_db
from ..services import cart_service

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("/", response_model=list[schemas.CartOut])
def get_all_cart(page: int = 1, limit: int = 10, db: Session = Depends(get_db)):
    return cart_service.get_all_carts(db, page, limit)


@router.get("/{cart_id}", response_model=schemas.CartOut)
def get_cart(cart_id: int, db: Session = Depends(get_db)):
    return cart_service.get_cart(cart_id, db)


@router.post("/", response_model=schemas.CartUpdateOut)
def add_to_cart(
    payload: schemas.CartCreateRequest, db: Session = Depends(get_db)
):
    return cart_service.add_to_cart(payload, db)


@router.put("/{cart_id}", response_model=schemas.CartUpdateOut)
def update_cart(
    cart_id: int, payload: schemas.CartUpdate, db: Session = Depends(get_db)
):
    return cart_service.update_cart(cart_id, payload, db)


@router.delete("/{cart_id}")
def delete_cart(cart_id: int, db: Session = Depends(get_db)):
    return cart_service.delete_cart(cart_id, db)
