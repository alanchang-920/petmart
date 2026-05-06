from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import products
from .database import Base, engine
from .routers import cart
from .routers import users

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(cart.router)
# The user router is included after product and cart routers.
app.include_router(users.router)
@app.get("/")
def read_root():
    return {"message": "MiniMart API is running"}