from backend.database import SessionLocal
from backend.models import Area, Indicator, Score, Opportunity

db = SessionLocal()

# -------------------------------
# Seed Areas
# -------------------------------
areas = ["CBD", "Westlands", "Kilimani", "Karen", "Ruiru"]
area_objs = {}

for name in areas:
    existing = db.query(Area).filter_by(name=name).first()
    if not existing:
        new_area = Area(name=name)
        db.add(new_area)
        db.commit()
        db.refresh(new_area)
        area_objs[name] = new_area
    else:
        area_objs[name] = existing

# -------------------------------
# Seed Indicators
# -------------------------------
sample_indicators = {
    "CBD": {"population": 200000, "mobility_score": 0.7, "environment_score": 0.6,
            "infrastructure_score": 0.8, "business_activity_score": 0.9},
    "Westlands": {"population": 150000, "mobility_score": 0.6, "environment_score": 0.7,
                  "infrastructure_score": 0.7, "business_activity_score": 0.8},
    "Kilimani": {"population": 100000, "mobility_score": 0.5, "environment_score": 0.8,
                 "infrastructure_score": 0.6, "business_activity_score": 0.7},
    "Karen": {"population": 80000, "mobility_score": 0.4, "environment_score": 0.9,
              "infrastructure_score": 0.5, "business_activity_score": 0.6},
    "Ruiru": {"population": 120000, "mobility_score": 0.6, "environment_score": 0.5,
              "infrastructure_score": 0.7, "business_activity_score": 0.7},
}

for name, data in sample_indicators.items():
    area_id = area_objs[name].id
    if not db.query(Indicator).filter_by(area_id=area_id).first():
        db.add(Indicator(area_id=area_id, **data))

# -------------------------------
# Seed Scores
# -------------------------------
sample_scores = {
    "CBD": {"health_score": 0.78, "growth_index": 0.82, "infra_index": 0.80, "opportunity_score": 0.85},
    "Westlands": {"health_score": 0.74, "growth_index": 0.79, "infra_index": 0.76, "opportunity_score": 0.78},
    "Kilimani": {"health_score": 0.70, "growth_index": 0.75, "infra_index": 0.72, "opportunity_score": 0.72},
    "Karen": {"health_score": 0.68, "growth_index": 0.70, "infra_index": 0.65, "opportunity_score": 0.69},
    "Ruiru": {"health_score": 0.72, "growth_index": 0.73, "infra_index": 0.74, "opportunity_score": 0.71},
}

for name, data in sample_scores.items():
    area_id = area_objs[name].id
    if not db.query(Score).filter_by(area_id=area_id).first():
        db.add(Score(area_id=area_id, **data))

# -------------------------------
# Seed Opportunities
# -------------------------------
sample_opportunities = [
    {"area": "CBD", "industry": "Food", "opportunity_score": 0.85},
    {"area": "Westlands", "industry": "Food", "opportunity_score": 0.78},
    {"area": "Kilimani", "industry": "Food", "opportunity_score": 0.72},
    {"area": "Karen", "industry": "Food", "opportunity_score": 0.69},
    {"area": "Ruiru", "industry": "Food", "opportunity_score": 0.71},
    {"area": "CBD", "industry": "Tech", "opportunity_score": 0.82},
    {"area": "Westlands", "industry": "Tech", "opportunity_score": 0.76},
    {"area": "Kilimani", "industry": "Tech", "opportunity_score": 0.70},
    {"area": "Karen", "industry": "Tech", "opportunity_score": 0.65},
    {"area": "Ruiru", "industry": "Tech", "opportunity_score": 0.73},
]

for opp in sample_opportunities:
    existing = db.query(Opportunity).filter_by(area=opp["area"], industry=opp["industry"]).first()
    if not existing:
        db.add(Opportunity(**opp))

db.commit()
db.close()

print("✅ Areas, Indicators, Scores, and Opportunities seeded successfully!")
