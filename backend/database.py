import os
from sqlalchemy import create_engine, pool
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables from .env if present
load_dotenv()

# Use environment variable for database URL
# Falls back to SQLite for local development
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./citypulse.db")

if DATABASE_URL.startswith("postgresql"):
    # Neon/Postgres connection
    # Use NullPool (no pooling) to avoid unsupported startup parameters
    engine = create_engine(
        DATABASE_URL,
        poolclass=pool.NullPool,
        connect_args={
            "connect_timeout": 10,
            "sslmode": "require"   # enforce SSL for Neon
        },
    )
else:
    # SQLite for local development
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()
