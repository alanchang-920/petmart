from fastapi import HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session

from .. import models, schemas


def _to_cart_out(cart: models.Cart) -> schemas.CartOut:
    return schemas.CartOut(
        id=cart.id,
        user_id=cart.user_id,
        status=cart.status,
        total_price=float(cart.total_price),
        recipient_name=cart.recipient_name,
        phone=cart.phone,
        shipping_address=cart.shipping_address,
        note=cart.note,
        items=[
            schemas.CartItemDetail(
                id=item.id,
                product_id=item.product_id,
                product_name=item.product.name,
                product_price=float(item.product.price),
                quantity=item.quantity,
            )
            for item in cart.items
        ],
    )


def get_all_carts(
    db: Session,
    page: int = 1,
    limit: int = 10,
    search: str | None = None,
    status: str | None = None,
):
    """Paginated list of carts with optional text search + status filter.

    `search` is matched case-insensitively against recipient name, phone, and
    shipping address — and against `cart.id` when it parses as an integer so
    an admin can paste an ID straight in.
    """
    query = db.query(models.Cart)

    if search:
        term = search.strip()
        if term:
            like = f"%{term}%"
            conditions = [
                models.Cart.recipient_name.ilike(like),
                models.Cart.phone.ilike(like),
                models.Cart.shipping_address.ilike(like),
            ]
            if term.isdigit():
                conditions.append(models.Cart.id == int(term))
            query = query.filter(or_(*conditions))

    if status:
        query = query.filter(models.Cart.status == status)

    # Newest first — admins almost always want recent activity at the top.
    carts = (
        query.order_by(models.Cart.id.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    return [_to_cart_out(cart) for cart in carts]


def get_cart(cart_id: int, db: Session):
    cart = db.query(models.Cart).filter(models.Cart.id == cart_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    return _to_cart_out(cart)


def add_to_cart(payload: schemas.CartCreateRequest, db: Session, user_id: int | None = None):
    items = payload.items
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

    cart = models.Cart(
        total_price=total_price,
        user_id=user_id,
        recipient_name=payload.recipient_name,
        phone=payload.phone,
        shipping_address=payload.shipping_address,
        note=payload.note,
    )
    db.add(cart)
    db.commit()
    db.refresh(cart)

    for item in items:
        new_item = models.CartItem(product_id=item.product_id, quantity=item.quantity, cart_id=cart.id)
        db.add(new_item)
    db.commit()
    db.refresh(cart)
    return cart


def update_cart(cart_id: int, cart_update: schemas.CartUpdate, db: Session):
    cart = db.query(models.Cart).filter(models.Cart.id == cart_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    for field, value in cart_update.model_dump(exclude_unset=True).items():
        setattr(cart, field, value)
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
