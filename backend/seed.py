from backend.database import SessionLocal, engine
from backend import models
from backend.models import Area, Indicator, Score, Opportunity

# -------------------------------
# Reset DB (drop + recreate tables)
# -------------------------------
print("⚠️ Resetting database...")
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)
print("✅ Database reset complete.")

db = SessionLocal()

# -------------------------------
# Seed Areas
# -------------------------------
areas = [
    "CBD", "Westlands", "Kilimani", "Karen", "Ruiru",
    "Kibera", "Dagoretti",
    "Embakasi", "Kasarani", "Upperhill", "Lavington",
    "South B", "South C", "Mathare"
]
area_objs = {}

for name in areas:
    new_area = Area(name=name)
    db.add(new_area)
    db.commit()
    db.refresh(new_area)
    area_objs[name] = new_area

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
    "Kibera": {"population": 250000, "mobility_score": 0.4, "environment_score": 0.45,
               "infrastructure_score": 0.5, "business_activity_score": 0.6},
    "Dagoretti": {"population": 130000, "mobility_score": 0.55, "environment_score": 0.6,
                  "infrastructure_score": 0.65, "business_activity_score": 0.7},
    "Embakasi": {"population": 300000, "mobility_score": 0.5, "environment_score": 0.55,
                 "infrastructure_score": 0.6, "business_activity_score": 0.65},
    "Kasarani": {"population": 220000, "mobility_score": 0.58, "environment_score": 0.6,
                 "infrastructure_score": 0.62, "business_activity_score": 0.68},
    "Upperhill": {"population": 90000, "mobility_score": 0.7, "environment_score": 0.65,
                  "infrastructure_score": 0.75, "business_activity_score": 0.85},
    "Lavington": {"population": 110000, "mobility_score": 0.6, "environment_score": 0.7,
                  "infrastructure_score": 0.68, "business_activity_score": 0.72},
    "South B": {"population": 95000, "mobility_score": 0.55, "environment_score": 0.6,
                "infrastructure_score": 0.65, "business_activity_score": 0.7},
    "South C": {"population": 100000, "mobility_score": 0.57, "environment_score": 0.62,
                "infrastructure_score": 0.66, "business_activity_score": 0.71},
    "Mathare": {"population": 270000, "mobility_score": 0.35, "environment_score": 0.4,
                "infrastructure_score": 0.45, "business_activity_score": 0.5},
}

for name, data in sample_indicators.items():
    db.add(Indicator(area_id=area_objs[name].id, **data))

# -------------------------------
# Seed Scores
# -------------------------------
sample_scores = {
    "CBD": {"health_score": 0.78, "growth_index": 0.82, "infra_index": 0.80, "opportunity_score": 0.85},
    "Westlands": {"health_score": 0.74, "growth_index": 0.79, "infra_index": 0.76, "opportunity_score": 0.78},
    "Kilimani": {"health_score": 0.70, "growth_index": 0.75, "infra_index": 0.72, "opportunity_score": 0.72},
    "Karen": {"health_score": 0.68, "growth_index": 0.70, "infra_index": 0.65, "opportunity_score": 0.69},
    "Ruiru": {"health_score": 0.72, "growth_index": 0.73, "infra_index": 0.74, "opportunity_score": 0.71},
    "Kibera": {"health_score": 0.65, "growth_index": 0.68, "infra_index": 0.6, "opportunity_score": 0.66},
    "Dagoretti": {"health_score": 0.71, "growth_index": 0.72, "infra_index": 0.7, "opportunity_score": 0.72},
    "Embakasi": {"health_score": 0.69, "growth_index": 0.71, "infra_index": 0.68, "opportunity_score": 0.7},
    "Kasarani": {"health_score": 0.72, "growth_index": 0.74, "infra_index": 0.7, "opportunity_score": 0.73},
    "Upperhill": {"health_score": 0.75, "growth_index": 0.78, "infra_index": 0.76, "opportunity_score": 0.8},
    "Lavington": {"health_score": 0.73, "growth_index": 0.75, "infra_index": 0.72, "opportunity_score": 0.74},
    "South B": {"health_score": 0.7, "growth_index": 0.72, "infra_index": 0.69, "opportunity_score": 0.71},
    "South C": {"health_score": 0.71, "growth_index": 0.73, "infra_index": 0.7, "opportunity_score": 0.72},
    "Mathare": {"health_score": 0.6, "growth_index": 0.62, "infra_index": 0.55, "opportunity_score": 0.58},
}

for name, data in sample_scores.items():
    db.add(Score(area_id=area_objs[name].id, **data))

# -------------------------------
# Seed Opportunities
# -------------------------------
sample_opportunities = []

industries = ["Food", "Tech", "Retail"]

for area in areas:
    for industry in industries:
        sample_opportunities.append({
            "area": area,
            "industry": industry,
            "opportunity_score": round(0.6 + hash(area+industry) % 30 / 100, 2)  # simple varied scores
        })

for opp in sample_opportunities:
    db.add(Opportunity(**opp))

db.commit()
db.close()

print("✅ Areas, Indicators, Scores, and Opportunities seeded successfully!")
