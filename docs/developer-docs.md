# 📘 Developer Docs: Database Models & Integration

## Overview
CityPulse uses **FastAPI + SQLAlchemy** for backend data management.  
The schema is defined in `models.py` and connects to a database (SQLite for local dev, PostgreSQL for production).  
Frontend (`App.js`) consumes JSON from FastAPI endpoints, which query these models.

---

## 📂 Project Structure
```
backend/
 ├── main.py          # FastAPI entry point (endpoints)
 ├── models.py        # SQLAlchemy ORM models
 ├── database.py      # DB engine + session setup
 ├── schemas.py       # Pydantic models for API I/O
 ├── crud.py          # Query helpers (optional)
 └── citypulse.db     # SQLite database file (local dev)
```

---

## ⚙️ Database Setup

### `database.py`
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./citypulse.db"  # dev
# For Postgres: "postgresql://user:password@localhost/citypulse"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
```

---

## 🗄️ Models (`models.py`)
```python
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Area(Base):
    __tablename__ = "areas"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    indicators = relationship("Indicator", back_populates="area")

class Indicator(Base):
    __tablename__ = "indicators"
    id = Column(Integer, primary_key=True, index=True)
    area_id = Column(Integer, ForeignKey("areas.id"))
    population = Column(Integer)
    mobility_score = Column(Float)
    environment_score = Column(Float)
    infrastructure_score = Column(Float)
    business_activity_score = Column(Float)
    area = relationship("Area", back_populates="indicators")

class Opportunity(Base):
    __tablename__ = "opportunities"
    id = Column(Integer, primary_key=True, index=True)
    area = Column(String)
    industry = Column(String)
    opportunity_score = Column(Float)
```

---

## 🔗 Connecting Models to FastAPI

### Dependency Injection
```python
# main.py
from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# DB session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

## 📊 Example Endpoints

### Area Profile
```python
@app.get("/area-profile/{id}")
def get_area_profile(id: int, db: Session = Depends(get_db)):
    area = db.query(models.Area).filter(models.Area.id == id).first()
    indicators = db.query(models.Indicator).filter(models.Indicator.area_id == id).first()
    return {"id": area.id, "name": area.name, "indicators": indicators.__dict__}
```

### Compare Areas
```python
@app.get("/compare-areas")
def compare_areas(area1: int, area2: int, db: Session = Depends(get_db)):
    a1 = db.query(models.Area).filter(models.Area.id == area1).first()
    a2 = db.query(models.Area).filter(models.Area.id == area2).first()
    return {"area1": {"name": a1.name, "indicators": a1.indicators[0].__dict__},
            "area2": {"name": a2.name, "indicators": a2.indicators[0].__dict__}}
```

### Opportunity Engine
```python
@app.post("/opportunity-engine")
def opportunity_engine(industry: str, db: Session = Depends(get_db)):
    opportunities = db.query(models.Opportunity).filter(models.Opportunity.industry == industry).all()
    return {"ranked_opportunities": [o.__dict__ for o in opportunities]}
```

---

## 🚀 Developer Notes
- **Local Dev**: Use SQLite (`citypulse.db`) for simplicity.  
- **Production**: Switch to PostgreSQL by updating `SQLALCHEMY_DATABASE_URL`.  
- **Migrations**: Use [Alembic](https://alembic.sqlalchemy.org/) for schema changes.  
- **Testing**: Seed mock data into SQLite for frontend demos.  
- **Frontend Integration**: React (`App.js`) fetches these endpoints; if backend fails, it falls back to `mockData.js`.

---

## ✅ Summary
- Keep schema in `models.py`.  
- Configure DB in `database.py`.  
- Define endpoints in `main.py`.  
- Use SQLite locally, PostgreSQL in production.  
- Frontend auto‑fallback ensures smooth demos even if backend is offline.
