import os
from sqlalchemy import create_engine, pool
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Use environment variable for database URL
# Falls back to SQLite for local development
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./citypulse.db"
)

# Check if using PostgreSQL (from Neon or other provider)
if DATABASE_URL.startswith("postgresql"):
    # PostgreSQL connection with connection pooling
    # Conservative settings for Neon free tier
    engine = create_engine(
        DATABASE_URL,
        poolclass=pool.NullPool,  # Neon recommends NullPool
        connect_args={
            "connect_timeout": 10,
            "options": "-c statement_timeout=30000",
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
