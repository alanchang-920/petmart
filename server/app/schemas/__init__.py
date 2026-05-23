"""Pydantic schemas (request/response models) for the PetMart API.

One file per resource. Re-exported here so call-sites can write
`from app import schemas` and reach `schemas.ProductOut`, `schemas.CartOut`, etc.
"""

from .product_schema import (
    ProductBase,
    ProductCreate,
    ProductUpdate,
    ProductOut,
)
from .cart_schema import (
    CartItemCreate,
    CartItemOut,
    CartItemDetail,
    CartCreateRequest,
    CartUpdate,
    CartUpdateOut,
    CartOut,
)
from .user_schema import (
    UserCreate,
    UserLogin,
    UserUpdate,
    UserOut,
    AdminCreate,
    AdminUpdate,
)

__all__ = [
    # product
    "ProductBase",
    "ProductCreate",
    "ProductUpdate",
    "ProductOut",
    # cart
    "CartItemCreate",
    "CartItemOut",
    "CartItemDetail",
    "CartCreateRequest",
    "CartUpdate",
    "CartUpdateOut",
    "CartOut",
    # user
    "UserCreate",
    "UserLogin",
    "UserUpdate",
    "UserOut",
    "AdminCreate",
    "AdminUpdate",
]
