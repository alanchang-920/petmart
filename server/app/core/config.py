"""Centralised runtime configuration loaded from environment variables.

Reading env vars in one place lets the rest of the codebase import constants
instead of sprinkling `os.getenv` calls everywhere — and makes it obvious which
values must be supplied via `.env` to run the app.
"""

import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL: str = os.getenv("DATABASE_URL", "")

# JWT settings. SECRET_KEY MUST be overridden via .env in any non-dev environment.
JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "dev-only-insecure-secret")
JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
