from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./citypulse.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Area(Base):
    __tablename__ = "areas"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

class Indicator(Base):
    __tablename__ = "indicators"
    id = Column(Integer, primary_key=True, index=True)
    area_id = Column(Integer)
    population = Column(Integer)
    mobility_score = Column(Float)
    environment_score = Column(Float)
    infrastructure_score = Column(Float)
    business_activity_score = Column(Float)

class Score(Base):
    __tablename__ = "scores"
    id = Column(Integer, primary_key=True, index=True)
    area_id = Column(Integer)
    health_score = Column(Float)
    growth_index = Column(Float)
    infra_index = Column(Float)
    opportunity_score = Column(Float)

# Create tables
Base.metadata.create_all(bind=engine)
