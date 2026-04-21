from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models
from ..database import SessionLocal
from .. import schemas

router = APIRouter(prefix="/cart", tags=["cart"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[schemas.CartItemOut])
def get_cart_items(db: Session = Depends(get_db)):
    return db.query(models.CartItem).all()

@router.post("/", response_model=schemas.CartItemOut)
def add_to_cart(item: schemas.CartItemCreate, db: Session = Depends(get_db)):
    existing = db.query(models.CartItem).filter(models.CartItem.product_id == item.product_id).first()

    if existing:
        existing.quantity += item.quantity
        db.commit()
        db.refresh(existing)
        return existing

    new_item = models.CartItem(**item.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/{cart_item_id}", response_model=schemas.CartItemOut)
def update_cart_item(cart_item_id: int, item: schemas.CartItemUpdate, db: Session = Depends(get_db)):
    db_item = db.query(models.CartItem).filter(models.CartItem.id == cart_item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db_item.quantity = item.quantity
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{cart_item_id}")
def delete_cart_item(cart_item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.CartItem).filter(models.CartItem.id == cart_item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(db_item)
    db.commit()
    return {"message": "Cart item removed successfully"}