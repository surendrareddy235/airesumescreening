from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base
from config import settings

Base = declarative_base()

# Create engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=True  # Set to False in production
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
