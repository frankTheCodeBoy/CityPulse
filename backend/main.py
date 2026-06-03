from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from backend.database import SessionLocal, engine
from backend import models

# Ensure tables exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CityPulse Urban Intelligence")

# Allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency: DB session


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -----------------------------------------------
# Cities
# -----------------------------------------------


@app.get("/cities")
def list_cities(db: Session = Depends(get_db)):
    """Return all cities for city selector."""
    return [
        {"id": c.id, "name": c.name}
        for c in db.query(models.City).all()
    ]


# -----------------------------------------------
# Areas by City
# -----------------------------------------------


@app.get("/areas/{city_id}")
def list_areas_by_city(city_id: int, db: Session = Depends(get_db)):
    """Return areas belonging to a specific city."""
    return [
        {"id": a.id, "name": a.name}
        for a in db.query(models.Area).filter(
            models.Area.city_id == city_id
        ).all()
    ]


# -----------------------------------------------
# Area Profile
# -----------------------------------------------


@app.get("/area-profile/{area_id}")
def get_area_profile(area_id: int, db: Session = Depends(get_db)):
    area = db.query(models.Area).filter(
        models.Area.id == area_id
    ).first()
    indicators = db.query(models.Indicator).filter(
        models.Indicator.area_id == area_id
    ).first()

    if not area:
        return {
            "id": area_id,
            "name": "Select an area to analyze",
            "indicators": {}
        }

    return {
        "id": area.id,
        "name": area.name,
        "indicators": {
            "population": indicators.population
            if indicators else None,
            "mobility_score": indicators.mobility_score
            if indicators else None,
            "environment_score": indicators.environment_score
            if indicators else None,
            "infrastructure_score": indicators.infrastructure_score
            if indicators else None,
            "business_activity_score":
                indicators.business_activity_score
            if indicators else None,
        },
    }


# -----------------------------------------------
# Urban Health Score
# -----------------------------------------------


@app.get("/urban-health-score/{area_id}")
def get_health_score(area_id: int, db: Session = Depends(get_db)):
    indicators = db.query(models.Indicator).filter(
        models.Indicator.area_id == area_id
    ).first()
    if not indicators:
        return {"message": "Select an area to calculate health score"}

    weights = {
        "population": 0.1,
        "mobility_score": 0.25,
        "environment_score": 0.2,
        "infrastructure_score": 0.25,
        "business_activity_score": 0.2,
    }

    pop_factor = (indicators.population or 0) / 100000

    score = (
        pop_factor * weights["population"]
        + (indicators.mobility_score or 0)
        * weights["mobility_score"]
        + (indicators.environment_score or 0)
        * weights["environment_score"]
        + (indicators.infrastructure_score or 0)
        * weights["infrastructure_score"]
        + (indicators.business_activity_score or 0)
        * weights["business_activity_score"]
    )

    existing = db.query(models.Score).filter(
        models.Score.area_id == area_id
    ).first()
    if existing:
        existing.health_score = score
    else:
        db.add(models.Score(area_id=area_id, health_score=score))
    db.commit()

    return {"area_id": area_id, "urban_health_score": round(score, 2)}


# -----------------------------------------------
# Compare Areas
# -----------------------------------------------


@app.get("/compare-areas")
def compare_areas(area1: int, area2: int,
                  db: Session = Depends(get_db)):
    a1 = db.query(models.Area).filter(
        models.Area.id == area1
    ).first()
    a2 = db.query(models.Area).filter(
        models.Area.id == area2
    ).first()
    if not a1 or not a2:
        return {"message": "Choose two areas to compare"}

    ind1 = db.query(models.Indicator).filter(
        models.Indicator.area_id == area1
    ).first()
    ind2 = db.query(models.Indicator).filter(
        models.Indicator.area_id == area2
    ).first()

    score1 = db.query(models.Score).filter(
        models.Score.area_id == area1
    ).first()
    score2 = db.query(models.Score).filter(
        models.Score.area_id == area2
    ).first()

    return {
        "area1": {
            "id": a1.id,
            "name": a1.name,
            "indicators": {
                "population": ind1.population
                if ind1 else None,
                "mobility_score": ind1.mobility_score
                if ind1 else None,
                "environment_score": ind1.environment_score
                if ind1 else None,
                "infrastructure_score":
                    ind1.infrastructure_score
                if ind1 else None,
                "business_activity_score":
                    ind1.business_activity_score
                if ind1 else None,
            },
            "scores": {
                "health_score": score1.health_score
                if score1 else None,
                "growth_index": score1.growth_index
                if score1 else None,
                "infra_index": score1.infra_index
                if score1 else None,
                "opportunity_score": score1.opportunity_score
                if score1 else None,
            },
        },
        "area2": {
            "id": a2.id,
            "name": a2.name,
            "indicators": {
                "population": ind2.population
                if ind2 else None,
                "mobility_score": ind2.mobility_score
                if ind2 else None,
                "environment_score": ind2.environment_score
                if ind2 else None,
                "infrastructure_score":
                    ind2.infrastructure_score
                if ind2 else None,
                "business_activity_score":
                    ind2.business_activity_score
                if ind2 else None,
            },
            "scores": {
                "health_score": score2.health_score
                if score2 else None,
                "growth_index": score2.growth_index
                if score2 else None,
                "infra_index": score2.infra_index
                if score2 else None,
                "opportunity_score": score2.opportunity_score
                if score2 else None,
            },
        },
    }


# -----------------------------------------------
# Opportunity Engine
# -----------------------------------------------


class OpportunityRequest(BaseModel):
    business_type: str
    industry: str


@app.post("/opportunity-engine")
def opportunity_engine(request: OpportunityRequest,
                       db: Session = Depends(get_db)):
    opportunities = (
        db.query(models.Opportunity)
        .filter(models.Opportunity.industry == request.industry)
        .all()
    )
    if not opportunities:
        return {
            "business_type": request.business_type,
            "industry": request.industry,
            "ranked_opportunities": [],
            "message": "Select an industry and run analysis",
        }

    ranked = sorted(
        [
            {
                "area": o.area,
                "opportunity_score": round(o.opportunity_score, 2)
            }
            for o in opportunities
        ],
        key=lambda x: x["opportunity_score"],
        reverse=True,
    )

    return {
        "business_type": request.business_type,
        "industry": request.industry,
        "ranked_opportunities": ranked,
    }


# -----------------------------------------------
# Areas list (all areas, kept for compatibility)
# -----------------------------------------------


@app.get("/areas")
def list_areas(db: Session = Depends(get_db)):
    """Return all areas with id and name for dropdowns."""
    return [{"id": a.id, "name": a.name}
            for a in db.query(models.Area).all()]


# -----------------------------------------------
# Industries list for dropdown
# -----------------------------------------------


@app.get("/industries")
def list_industries(db: Session = Depends(get_db)):
    """Return distinct industries from opportunities."""
    industries = db.query(
        models.Opportunity.industry
    ).distinct().all()
    return [i[0] for i in industries]
