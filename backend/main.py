from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from .database import SessionLocal, Area, Indicator, Score

app = FastAPI(title="CityPulse Urban Intelligence")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/area-profile/{area_id}")
def get_area_profile(area_id: int, db: Session = Depends(get_db)):
    area = db.query(Area).filter(Area.id == area_id).first()
    if area:
        return {"id": area.id, "name": area.name}
    return {"error": "Area not found"}

@app.get("/urban-health-score/{area_id}")
def get_health_score(area_id: int, db: Session = Depends(get_db)):
    indicators = db.query(Indicator).filter(Indicator.area_id == area_id).first()
    if not indicators:
        return {"error": "No indicators found for this area"}

    # Define weights (adjust later as needed)
    weights = {
        "population": 0.1,
        "mobility_score": 0.25,
        "environment_score": 0.2,
        "infrastructure_score": 0.25,
        "business_activity_score": 0.2,
    }

    # Normalize population (simple demo: divide by 100k)
    pop_factor = (indicators.population or 0) / 100000

    # Weighted sum
    score = (
        pop_factor * weights["population"]
        + (indicators.mobility_score or 0) * weights["mobility_score"]
        + (indicators.environment_score or 0) * weights["environment_score"]
        + (indicators.infrastructure_score or 0) * weights["infrastructure_score"]
        + (indicators.business_activity_score or 0) * weights["business_activity_score"]
    )

    # Save to scores table (optional)
    existing = db.query(Score).filter(Score.area_id == area_id).first()
    if existing:
        existing.health_score = score
    else:
        db.add(Score(area_id=area_id, health_score=score))
    db.commit()

    return {"area_id": area_id, "urban_health_score": round(score, 2)}

@app.get("/compare-areas")
def compare_areas(area1: int, area2: int, db: Session = Depends(get_db)):
    a1 = db.query(Area).filter(Area.id == area1).first()
    a2 = db.query(Area).filter(Area.id == area2).first()
    if not a1 or not a2:
        return {"error": "One or both areas not found"}

    ind1 = db.query(Indicator).filter(Indicator.area_id == area1).first()
    ind2 = db.query(Indicator).filter(Indicator.area_id == area2).first()

    score1 = db.query(Score).filter(Score.area_id == area1).first()
    score2 = db.query(Score).filter(Score.area_id == area2).first()

    return {
        "area1": {
            "id": a1.id,
            "name": a1.name,
            "indicators": {
                "population": ind1.population if ind1 else None,
                "mobility_score": ind1.mobility_score if ind1 else None,
                "environment_score": ind1.environment_score if ind1 else None,
                "infrastructure_score": ind1.infrastructure_score if ind1 else None,
                "business_activity_score": ind1.business_activity_score if ind1 else None,
            },
            "scores": {
                "health_score": score1.health_score if score1 else None,
                "growth_index": score1.growth_index if score1 else None,
                "infra_index": score1.infra_index if score1 else None,
                "opportunity_score": score1.opportunity_score if score1 else None,
            }
        },
        "area2": {
            "id": a2.id,
            "name": a2.name,
            "indicators": {
                "population": ind2.population if ind2 else None,
                "mobility_score": ind2.mobility_score if ind2 else None,
                "environment_score": ind2.environment_score if ind2 else None,
                "infrastructure_score": ind2.infrastructure_score if ind2 else None,
                "business_activity_score": ind2.business_activity_score if ind2 else None,
            },
            "scores": {
                "health_score": score2.health_score if score2 else None,
                "growth_index": score2.growth_index if score2 else None,
                "infra_index": score2.infra_index if score2 else None,
                "opportunity_score": score2.opportunity_score if score2 else None,
            }
        }
    }

# Request model for Opportunity Engine
class OpportunityRequest(BaseModel):
    business_type: str
    industry: str

@app.post("/opportunity-engine")
def opportunity_engine(req: OpportunityRequest, db: Session = Depends(get_db)):
    business_type = req.business_type
    industry = req.industry

    areas = db.query(Area).all()
    results = []

    # Industry-specific weights
    if industry.lower() == "food":
        weights = {"population":0.5, "mobility":0.3, "environment":0.0, "infrastructure":0.0, "business_activity":-0.2}
    elif industry.lower() == "tech":
        weights = {"population":0.3, "mobility":0.0, "environment":0.3, "infrastructure":0.4, "business_activity":0.0}
    elif industry.lower() == "retail":
        weights = {"population":0.4, "mobility":0.3, "environment":0.0, "infrastructure":0.0, "business_activity":-0.3}
    else:
        weights = {"population":0.4, "mobility":0.3, "environment":0.0, "infrastructure":0.0, "business_activity":-0.3}

    # Calculate scores per area
    for area in areas:
        ind = db.query(Indicator).filter(Indicator.area_id == area.id).first()
        if not ind:
            continue

        score = (
            (ind.population or 0)/100000 * weights["population"]
            + (ind.mobility_score or 0) * weights["mobility"]
            + (ind.environment_score or 0) * weights["environment"]
            + (ind.infrastructure_score or 0) * weights["infrastructure"]
            + (ind.business_activity_score or 0) * weights["business_activity"]
        )

        results.append({"area": area.name, "opportunity_score": round(score, 2)})

        # Save to scores table
        existing = db.query(Score).filter(Score.area_id == area.id).first()
        if existing:
            existing.opportunity_score = score
        else:
            db.add(Score(area_id=area.id, opportunity_score=score))
    db.commit()

    ranked = sorted(results, key=lambda x: x["opportunity_score"], reverse=True)

    return {
        "business_type": business_type,
        "industry": industry,
        "ranked_opportunities": ranked
    }
