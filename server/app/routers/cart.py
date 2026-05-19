from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..core.security import get_current_user, require_admin
from ..database import get_db
from ..services import cart_service

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("/", response_model=list[schemas.CartOut])
def get_all_cart(
    page: int = 1,
    limit: int = 10,
    search: str | None = None,
    status: str | None = None,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    """Admin-only: paginated list of carts with optional search + status filter."""
    return cart_service.get_all_carts(
        db, page=page, limit=limit, search=search, status=status
    )


@router.get("/{cart_id}", response_model=schemas.CartOut)
def get_cart(
    cart_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    return cart_service.get_cart(cart_id, db)


@router.post("/", response_model=schemas.CartUpdateOut)
def add_to_cart(
    payload: schemas.CartCreateRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Any authenticated user can place an order; the cart is linked to them."""
    return cart_service.add_to_cart(payload, db, user_id=current_user.id)


@router.put("/{cart_id}", response_model=schemas.CartUpdateOut)
def update_cart(
    cart_id: int,
    payload: schemas.CartUpdate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    return cart_service.update_cart(cart_id, payload, db)


@router.delete("/{cart_id}")
def delete_cart(
    cart_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    return cart_service.delete_cart(cart_id, db)
