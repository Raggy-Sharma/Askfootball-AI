from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# Engine = connection pool (like a database client instance)
# connect_args needed for SQLite to allow multi-thread access
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False  # Set True to see SQL queries in console
)

# SessionLocal = factory that creates database sessions
# Each request gets its own session (like a transaction scope)
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base = parent class for all ORM models
Base = declarative_base()

def get_db():
    """
    Dependency that provides a database session per request.
    FastAPI calls this automatically via Depends().
    The 'yield' pattern ensures the session closes after the request.
    """

    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()
