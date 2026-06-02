from database import SessionLocal, Indicator

db = SessionLocal()

# Sample indicator data for each area
sample_data = [
    {"area_id": 1, "population": 200000, "mobility_score": 0.7, "environment_score": 0.6, "infrastructure_score": 0.8, "business_activity_score": 0.9},  # CBD
    {"area_id": 2, "population": 150000, "mobility_score": 0.6, "environment_score": 0.7, "infrastructure_score": 0.7, "business_activity_score": 0.8},  # Westlands
    {"area_id": 3, "population": 100000, "mobility_score": 0.5, "environment_score": 0.8, "infrastructure_score": 0.6, "business_activity_score": 0.7},  # Kilimani
    {"area_id": 4, "population": 80000,  "mobility_score": 0.4, "environment_score": 0.9, "infrastructure_score": 0.5, "business_activity_score": 0.6},  # Karen
    {"area_id": 5, "population": 120000, "mobility_score": 0.6, "environment_score": 0.5, "infrastructure_score": 0.7, "business_activity_score": 0.7},  # Ruiru
]

for row in sample_data:
    # Only insert if not already present
    if not db.query(Indicator).filter_by(area_id=row["area_id"]).first():
        db.add(Indicator(**row))

db.commit()
db.close()

print("Indicators seeded successfully!")
