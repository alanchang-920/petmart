from sqlalchemy import Column, Integer, String, Text, DECIMAL, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class Cart(Base):
    __tablename__ = "carts"

    id = Column(Integer, primary_key=True, index=True)
    total_price = Column(DECIMAL(10, 2), nullable=False, default=0.00)
    user_id = Column(Integer, nullable=True)  # Optional: link to a user if you have authentication
    status = Column(String(20), default="pending")  # e.g., active, completed, cancelled
    recipient_name = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    shipping_address = Column(Text, nullable=True)
    note = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")