from fastapi import HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas


def get_all_carts(db: Session, page: int = 1, limit: int = 10):
    offset = (page - 1) * limit
    carts = db.query(models.Cart).offset(offset).limit(limit).all()
    return [
        schemas.CartOut(
            id=cart.id,
            user_id=cart.user_id,
            status=cart.status,
            total_price=float(cart.total_price),
            items=[
                schemas.CartItemDetail(
                    id=item.id,
                    product_id=item.product_id,
                    product_name=item.product.name,
                    product_price=float(item.product.price),
                    quantity=item.quantity
                )
                for item in cart.items
            ]
        )
        for cart in carts
    ]   


def get_cart(cart_id: int, db: Session):
    cart = db.query(models.Cart).filter(models.Cart.id == cart_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    return schemas.CartOut(
        id=cart.id,
        user_id=cart.user_id,
        status=cart.status,
        total_price=float(cart.total_price),
        items=[
            schemas.CartItemDetail(
                id=item.id,
                product_id=item.product_id,
                product_name=item.product.name,
                product_price=float(item.product.price),
                quantity=item.quantity
            )
            for item in cart.items
        ]
    )


def add_to_cart(items: list[schemas.CartItemCreate], db: Session):
    total_price = 0.00
    for item in items:
        # Validate product existence and calculate total price
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        total_price += item.quantity * float(product.price)
        product.stock -= item.quantity  # Reduce stock
        if product.stock < 0:
            raise HTTPException(status_code=400, detail=f"Not enough stock for product {product.name}")
        db.add(product)

    cart = models.Cart(total_price=total_price)
    db.add(cart)
    db.commit()
    db.refresh(cart)

    for item in items:
        new_item = models.CartItem(product_id=item.product_id, quantity=item.quantity, cart_id=cart.id)
        db.add(new_item)
    db.commit()
    return cart


def update_cart(cart_id: int, cart_update: schemas.CartUpdate, db: Session):
    cart = db.query(models.Cart).filter(models.Cart.id == cart_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    cart.status = cart_update.status
    db.commit()
    db.refresh(cart)
    return cart


def delete_cart(cart_id: int, db: Session):
    cart = db.query(models.Cart).filter(models.Cart.id == cart_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    db.delete(cart)
    db.commit()
    return {"message": "Cart item removed successfully"}
