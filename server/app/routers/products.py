from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models
from .. import schemas
from ..database import get_db
from ..auth import require_admin

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=list[schemas.ProductOut])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

@router.post("/", response_model=schemas.ProductOut)
def create_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(require_admin)
):
    new_product = models.Product(**product.dict())

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product

@router.put("/{product_id}", response_model=schemas.ProductOut)
def update_product(
    product_id: int,
    product: schemas.ProductUpdate,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(require_admin)
):
    db_product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if not db_product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    update_data = product.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)

    return db_product

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(require_admin)
):
    db_product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if not db_product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(db_product)
    db.commit()

    return {
        "message": "Product deleted successfully"
    }