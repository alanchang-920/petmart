"""Service layer — pure database/business logic, no FastAPI routing.

Routers import these modules and stay thin (parse request, call service,
shape response).
"""

from . import cart_service, product_service, user_service

__all__ = ["cart_service", "product_service", "user_service"]
