from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base


class Area(Base):
    __tablename__ = "areas"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    # Relationships
    indicators = relationship("Indicator", back_populates="area", uselist=False)
    scores = relationship("Score", back_populates="area", uselist=False)


class Indicator(Base):
    __tablename__ = "indicators"
    id = Column(Integer, primary_key=True, index=True)
    area_id = Column(Integer, ForeignKey("areas.id"))
    population = Column(Integer)
    mobility_score = Column(Float)
    environment_score = Column(Float)
    infrastructure_score = Column(Float)
    business_activity_score = Column(Float)

    # Relationship back to Area
    area = relationship("Area", back_populates="indicators")


class Score(Base):
    __tablename__ = "scores"
    id = Column(Integer, primary_key=True, index=True)
    area_id = Column(Integer, ForeignKey("areas.id"))
    health_score = Column(Float)
    growth_index = Column(Float)
    infra_index = Column(Float)
    opportunity_score = Column(Float)

    # Relationship back to Area
    area = relationship("Area", back_populates="scores")


class Opportunity(Base):
    __tablename__ = "opportunities"
    id = Column(Integer, primary_key=True, index=True)
    area = Column(String)
    industry = Column(String)
    opportunity_score = Column(Float)
