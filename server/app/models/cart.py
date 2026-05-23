from sqlalchemy import Boolean, Column, Integer, String, Text, DECIMAL, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..database import Base


class Cart(Base):
    """A customer order/cart with shipping details and a list of items."""

    __tablename__ = "carts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    status = Column(String(20), default="pending")
    total_price = Column(DECIMAL(10, 2), nullable=False, default=0.00)
    recipient_name = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    shipping_address = Column(Text, nullable=True)
    note = Column(Text, nullable=True)
    # Tracks whether the cart's items have already been added back to
    # product stock — set by auto-rollback on cancel and by the manual
    # "Restock" admin action. Prevents double-restocking the same cart.
    restocked = Column(Boolean, nullable=False, default=False, server_default="0")
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    items = relationship(
        "CartItem", back_populates="cart", cascade="all, delete-orphan"
    )


class CartItem(Base):
    """A line item in a Cart, referencing a Product and a quantity."""

    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(
        Integer, ForeignKey("carts.id", ondelete="CASCADE"), nullable=False
    )
    product_id = Column(
        Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False
    )
    quantity = Column(Integer, nullable=False, default=1)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    cart = relationship("Cart", back_populates="items")
    product = relationship("Product", back_populates="cart_items")
