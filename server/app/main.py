"""FastAPI application entrypoint.

Wires database table creation, CORS, and the three resource routers
(`/products`, `/cart`, `/users`).
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import cart, products, users

# Auto-create tables on startup. For production we'd swap this for Alembic.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="PetMart API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(cart.router)
app.include_router(users.router)


@app.get("/")
def read_root():
    return {"message": "PetMart API is running"}
