import re
from typing import Optional

from pydantic import BaseModel, Field, field_validator


PHONE_PATTERN = r"[0-9+\-\s]{8,20}"
PHONE_FORMAT_MESSAGE = (
    "Phone number must be 8-20 characters, digits only (spaces, + and - allowed)."
)


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int


class CartItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int

    class Config:
        from_attributes = True


class CartItemDetail(BaseModel):
    """Cart item enriched with the product name/price for display."""

    id: int
    product_id: int
    product_name: str
    product_price: float
    quantity: int

    class Config:
        from_attributes = True


class CartCreateRequest(BaseModel):
    """Payload submitted when a customer places an order."""

    items: list[CartItemCreate] = Field(
        min_length=1, description="At least one item is required."
    )
    recipient_name: str = Field(max_length=100)
    phone: str = Field(max_length=20)
    shipping_address: str
    note: Optional[str] = None

    @field_validator("note")
    @classmethod
    def normalize_note(cls, note):
        if note is None:
            return None
        note = note.strip()
        return note or None

    @field_validator("recipient_name", "phone", "shipping_address")
    @classmethod
    def require_non_empty_text(cls, value, field):
        value = (value or "").strip()
        if not value:
            raise ValueError(f"{field.field_name} is required.")
        return value

    @field_validator("phone")
    @classmethod
    def check_phone_format(cls, phone):
        if not re.fullmatch(PHONE_PATTERN, phone):
            raise ValueError(PHONE_FORMAT_MESSAGE)
        return phone


class CartUpdate(BaseModel):
    """Admin update — any combination of fields may be supplied."""

    status: Optional[str] = None
    recipient_name: Optional[str] = None
    phone: Optional[str] = None
    shipping_address: Optional[str] = None
    note: Optional[str] = None

    @field_validator("note")
    @classmethod
    def normalize_note(cls, note):
        if note is None:
            return None
        note = note.strip()
        return note or None

    @field_validator("recipient_name", "phone", "shipping_address")
    @classmethod
    def reject_blank_when_provided(cls, value, field):
        if value is None:
            return None
        value = value.strip()
        if not value:
            raise ValueError(f"{field.field_name} cannot be empty.")
        return value

    @field_validator("phone")
    @classmethod
    def check_phone_format(cls, phone):
        if phone is None:
            return None
        if not re.fullmatch(PHONE_PATTERN, phone):
            raise ValueError(PHONE_FORMAT_MESSAGE)
        return phone


class CartUpdateOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    status: Optional[str] = None
    total_price: float
    recipient_name: Optional[str] = None
    phone: Optional[str] = None
    shipping_address: Optional[str] = None
    note: Optional[str] = None

    class Config:
        from_attributes = True


class CartOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    status: Optional[str] = None
    total_price: float
    recipient_name: Optional[str] = None
    phone: Optional[str] = None
    shipping_address: Optional[str] = None
    note: Optional[str] = None
    items: list[CartItemDetail]

    class Config:
        from_attributes = True
