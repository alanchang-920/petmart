"""Database operations for the Product resource."""

from fastapi import HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas


def _validate_product_payload(payload) -> None:
    """Application-level guards mirrored on every write path.

    Pydantic stays permissive (admin tooling sometimes needs slack), but the
    service refuses values that would corrupt business logic — negative
    stock or a non-positive price.
    """
    # `model_dump(exclude_unset=True)` lets PATCH-style updates skip fields;
    # we only validate what the caller actually sent.
    data = payload.model_dump(exclude_unset=True)

    if "stock" in data and data["stock"] < 0:
        raise HTTPException(
            status_code=400, detail="Stock must be greater than or equal to 0."
        )
    if "price" in data and data["price"] <= 0:
        raise HTTPException(
            status_code=400, detail="Price must be greater than 0."
        )
    if "name" in data and not str(data["name"]).strip():
        raise HTTPException(status_code=400, detail="Name is required.")


def list_products(db: Session) -> list[models.Product]:
    return db.query(models.Product).all()


def create_product(db: Session, payload: schemas.ProductCreate) -> models.Product:
    _validate_product_payload(payload)
    product = models.Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def update_product(
    db: Session, product_id: int, payload: schemas.ProductUpdate
) -> models.Product:
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    _validate_product_payload(payload)

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product_id: int) -> dict:
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Refuse to delete a product that has already been ordered — silently
    # cascading would wipe historical line items from those carts.
    referenced = (
        db.query(models.CartItem)
        .filter(models.CartItem.product_id == product_id)
        .first()
    )
    if referenced:
        raise HTTPException(
            status_code=400,
            detail=(
                "Cannot delete this product — it is referenced by one or "
                "more existing orders. Remove or reassign those orders first."
            ),
        )

    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}
