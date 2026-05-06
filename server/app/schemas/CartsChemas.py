from pydantic import BaseModel
from typing import Optional

class CartCreate(BaseModel):
    user_id: Optional[int] = None  # Optional: link to a user if you have authentication
    status : Optional[str] = "pending"  # e.g., active, completed, cancelled

class CartUpdate(BaseModel):
    status : Optional[str] = None  # e.g., active, completed, cancelled

class CartUpdateOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    status: Optional[str] = None
    total_price: float

    class Config:
        from_attributes = True

class CartItemDetail(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_price: float
    quantity: int

    class Config:
        from_attributes = True

class CartOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    status: Optional[str] = None
    total_price: float
    items: list[CartItemDetail]

    class Config:
        from_attributes = True