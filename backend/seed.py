from database import SessionLocal, Area

db = SessionLocal()

areas = ["CBD", "Westlands", "Kilimani", "Karen", "Ruiru"]

for name in areas:
    if not db.query(Area).filter_by(name=name).first():
        db.add(Area(name=name))

db.commit()
db.close()
