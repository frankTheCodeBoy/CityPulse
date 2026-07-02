from backend.database import SessionLocal, engine
from backend import models
from backend.models import City, Area, Indicator, Score, Opportunity

# -----------------------------------------------
# Reset DB (drop + recreate tables)
# -----------------------------------------------
print("Resetting database...")
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)
print("Database reset complete.")

db = SessionLocal()

# -----------------------------------------------
# Seed Cities
# -----------------------------------------------
cities_data = ["Nairobi", "Mombasa", "Kisumu"]
cities_objs = {}

for city_name in cities_data:
    new_city = City(name=city_name)
    db.add(new_city)
    db.commit()
    db.refresh(new_city)
    cities_objs[city_name] = new_city

# -----------------------------------------------
# Seed Areas for each City
# -----------------------------------------------
areas_by_city = {
    "Nairobi": [
        "CBD", "Westlands", "Kilimani", "Karen",
        "Kibera", "Dagoretti", "Embakasi", "Kasarani",
        "Upperhill", "Lavington", "South B", "South C",
    ],
    "Mombasa": [
        "Nyali", "Likoni", "Bamburi", "Changamwe",
        "Kisauni", "Shanzu"
    ],
    "Kisumu": [
        "Kondele", "Manyatta", "Nyalenda", "Milimani",
        "Obunga", "Kibuye"
    ]
}

area_objs = {}

for city_name, area_names in areas_by_city.items():
    for area_name in area_names:
        new_area = Area(
            name=area_name,
            city_id=cities_objs[city_name].id
        )
        db.add(new_area)
        db.commit()
        db.refresh(new_area)
        area_objs[area_name] = new_area

# -----------------------------------------------
# Seed Indicators
# -----------------------------------------------
nairobi_indicators = {
    "CBD": {
        "population": 200000, "mobility_score": 0.7,
        "environment_score": 0.6, "infrastructure_score": 0.8,
        "business_activity_score": 0.9
    },
    "Westlands": {
        "population": 150000, "mobility_score": 0.6,
        "environment_score": 0.7, "infrastructure_score": 0.7,
        "business_activity_score": 0.8
    },
    "Kilimani": {
        "population": 100000, "mobility_score": 0.5,
        "environment_score": 0.8, "infrastructure_score": 0.6,
        "business_activity_score": 0.7
    },
    "Karen": {
        "population": 80000, "mobility_score": 0.4,
        "environment_score": 0.9, "infrastructure_score": 0.5,
        "business_activity_score": 0.6
    },
    "Kibera": {
        "population": 250000, "mobility_score": 0.4,
        "environment_score": 0.45, "infrastructure_score": 0.5,
        "business_activity_score": 0.6
    },
    "Dagoretti": {
        "population": 130000, "mobility_score": 0.55,
        "environment_score": 0.6, "infrastructure_score": 0.65,
        "business_activity_score": 0.7
    },
    "Embakasi": {
        "population": 300000, "mobility_score": 0.5,
        "environment_score": 0.55, "infrastructure_score": 0.6,
        "business_activity_score": 0.65
    },
    "Kasarani": {
        "population": 220000, "mobility_score": 0.58,
        "environment_score": 0.6, "infrastructure_score": 0.62,
        "business_activity_score": 0.68
    },
    "Upperhill": {
        "population": 90000, "mobility_score": 0.7,
        "environment_score": 0.65, "infrastructure_score": 0.75,
        "business_activity_score": 0.85
    },
    "Lavington": {
        "population": 110000, "mobility_score": 0.6,
        "environment_score": 0.7, "infrastructure_score": 0.68,
        "business_activity_score": 0.72
    },
    "South B": {
        "population": 95000, "mobility_score": 0.55,
        "environment_score": 0.6, "infrastructure_score": 0.65,
        "business_activity_score": 0.7
    },
    "South C": {
        "population": 100000, "mobility_score": 0.57,
        "environment_score": 0.62, "infrastructure_score": 0.66,
        "business_activity_score": 0.71
    },
}

mombasa_indicators = {
    "Nyali": {
        "population": 180000, "mobility_score": 0.65,
        "environment_score": 0.7, "infrastructure_score": 0.75,
        "business_activity_score": 0.8
    },
    "Likoni": {
        "population": 160000, "mobility_score": 0.55,
        "environment_score": 0.6, "infrastructure_score": 0.65,
        "business_activity_score": 0.7
    },
    "Bamburi": {
        "population": 140000, "mobility_score": 0.6,
        "environment_score": 0.65, "infrastructure_score": 0.7,
        "business_activity_score": 0.72
    },
    "Changamwe": {
        "population": 120000, "mobility_score": 0.58,
        "environment_score": 0.6, "infrastructure_score": 0.68,
        "business_activity_score": 0.7
    },
    "Kisauni": {
        "population": 200000, "mobility_score": 0.5,
        "environment_score": 0.55, "infrastructure_score": 0.6,
        "business_activity_score": 0.65
    },
    "Shanzu": {
        "population": 100000, "mobility_score": 0.62,
        "environment_score": 0.68, "infrastructure_score": 0.7,
        "business_activity_score": 0.73
    },
}

kisumu_indicators = {
    "Kondele": {
        "population": 150000, "mobility_score": 0.55,
        "environment_score": 0.6, "infrastructure_score": 0.65,
        "business_activity_score": 0.68
    },
    "Manyatta": {
        "population": 170000, "mobility_score": 0.5,
        "environment_score": 0.55, "infrastructure_score": 0.6,
        "business_activity_score": 0.62
    },
    "Nyalenda": {
        "population": 160000, "mobility_score": 0.52,
        "environment_score": 0.58, "infrastructure_score": 0.62,
        "business_activity_score": 0.65
    },
    "Milimani": {
        "population": 90000, "mobility_score": 0.7,
        "environment_score": 0.75, "infrastructure_score": 0.78,
        "business_activity_score": 0.82
    },
    "Obunga": {
        "population": 140000, "mobility_score": 0.48,
        "environment_score": 0.5, "infrastructure_score": 0.55,
        "business_activity_score": 0.6
    },
    "Kibuye": {
        "population": 130000, "mobility_score": 0.53,
        "environment_score": 0.57, "infrastructure_score": 0.6,
        "business_activity_score": 0.64
    },
}

all_indicators = {
    **nairobi_indicators,
    **mombasa_indicators,
    **kisumu_indicators
}

for name, data in all_indicators.items():
    db.add(Indicator(area_id=area_objs[name].id, **data))

# -----------------------------------------------
# Seed Scores
# -----------------------------------------------
nairobi_scores = {
    "CBD": {
        "health_score": 0.78, "growth_index": 0.82,
        "infra_index": 0.80, "opportunity_score": 0.85
    },
    "Westlands": {
        "health_score": 0.74, "growth_index": 0.79,
        "infra_index": 0.76, "opportunity_score": 0.78
    },
    "Kilimani": {
        "health_score": 0.70, "growth_index": 0.75,
        "infra_index": 0.72, "opportunity_score": 0.72
    },
    "Karen": {
        "health_score": 0.68, "growth_index": 0.70,
        "infra_index": 0.65, "opportunity_score": 0.69
    },
    "Kibera": {
        "health_score": 0.65, "growth_index": 0.68,
        "infra_index": 0.6, "opportunity_score": 0.66
    },
    "Dagoretti": {
        "health_score": 0.71, "growth_index": 0.72,
        "infra_index": 0.7, "opportunity_score": 0.72
    },
    "Embakasi": {
        "health_score": 0.69, "growth_index": 0.71,
        "infra_index": 0.68, "opportunity_score": 0.7
    },
    "Kasarani": {
        "health_score": 0.72, "growth_index": 0.74,
        "infra_index": 0.7, "opportunity_score": 0.73
    },
    "Upperhill": {
        "health_score": 0.75, "growth_index": 0.78,
        "infra_index": 0.76, "opportunity_score": 0.8
    },
    "Lavington": {
        "health_score": 0.73, "growth_index": 0.75,
        "infra_index": 0.72, "opportunity_score": 0.74
    },
    "South B": {
        "health_score": 0.70, "growth_index": 0.72,
        "infra_index": 0.69, "opportunity_score": 0.71
    },
    "South C": {
        "health_score": 0.71, "growth_index": 0.73,
        "infra_index": 0.7, "opportunity_score": 0.72
    },
}

mombasa_scores = {
    "Nyali": {
        "health_score": 0.76, "growth_index": 0.78,
        "infra_index": 0.77, "opportunity_score": 0.82
    },
    "Likoni": {
        "health_score": 0.68, "growth_index": 0.70,
        "infra_index": 0.68, "opportunity_score": 0.72
    },
    "Bamburi": {
        "health_score": 0.72, "growth_index": 0.74,
        "infra_index": 0.72, "opportunity_score": 0.75
    },
    "Changamwe": {
        "health_score": 0.70, "growth_index": 0.71,
        "infra_index": 0.70, "opportunity_score": 0.73
    },
    "Kisauni": {
        "health_score": 0.65, "growth_index": 0.67,
        "infra_index": 0.63, "opportunity_score": 0.68
    },
    "Shanzu": {
        "health_score": 0.74, "growth_index": 0.76,
        "infra_index": 0.74, "opportunity_score": 0.76
    },
}

kisumu_scores = {
    "Kondele": {
        "health_score": 0.69, "growth_index": 0.71,
        "infra_index": 0.69, "opportunity_score": 0.71
    },
    "Manyatta": {
        "health_score": 0.65, "growth_index": 0.67,
        "infra_index": 0.64, "opportunity_score": 0.66
    },
    "Nyalenda": {
        "health_score": 0.67, "growth_index": 0.69,
        "infra_index": 0.66, "opportunity_score": 0.68
    },
    "Milimani": {
        "health_score": 0.77, "growth_index": 0.79,
        "infra_index": 0.78, "opportunity_score": 0.82
    },
    "Obunga": {
        "health_score": 0.62, "growth_index": 0.64,
        "infra_index": 0.60, "opportunity_score": 0.63
    },
    "Kibuye": {
        "health_score": 0.66, "growth_index": 0.68,
        "infra_index": 0.65, "opportunity_score": 0.69
    },
}

all_scores = {
    **nairobi_scores,
    **mombasa_scores,
    **kisumu_scores
}

for name, data in all_scores.items():
    db.add(Score(area_id=area_objs[name].id, **data))

# -----------------------------------------------
# Seed Opportunities (using area_id FK, not string)
# -----------------------------------------------
industries = ["Food", "Tech", "Retail"]

for area_name, area_obj in area_objs.items():
    for industry in industries:
        db.add(Opportunity(
            area_id=area_obj.id,
            industry=industry,
            opportunity_score=round(
                0.6 + hash(area_name + industry) % 30 / 100, 2
            )
        ))

db.commit()
db.close()

print("Cities, Areas, Indicators, Scores, and Opportunities seeded!")
