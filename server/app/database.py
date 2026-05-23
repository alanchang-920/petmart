"""SQLAlchemy engine, session factory, and `get_db` FastAPI dependency."""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from .core.config import DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Yield a SQLAlchemy session that is closed after the request finishes."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
