from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..core.security import require_admin
from ..database import get_db
from ..services import product_service

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/", response_model=list[schemas.ProductOut])
def get_products(db: Session = Depends(get_db)):
    return product_service.list_products(db)


@router.post("/", response_model=schemas.ProductOut)
def create_product(
    payload: schemas.ProductCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    return product_service.create_product(db, payload)


@router.put("/{product_id}", response_model=schemas.ProductOut)
def update_product(
    product_id: int,
    payload: schemas.ProductUpdate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    return product_service.update_product(db, product_id, payload)


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    return product_service.delete_product(db, product_id)
