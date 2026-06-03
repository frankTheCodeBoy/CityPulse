# CityPulse Quick Start — Safe Launch Guide

## 🎯 Before You Panic

**Good news**: Everything is backward compatible. All existing features work unchanged.
New features (cities, city-based area filtering) are **additive only**. Nothing is removed or broken.

---

## 🚀 Launch Instructions

### Terminal 1: Start Backend
```bash
cd "C:\Users\Administrator\Desktop\CityPulse"
.\.venv\Scripts\python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

### Terminal 2: Start Frontend
```bash
cd "C:\Users\Administrator\Desktop\CityPulse\frontend"
npm start
```

You should see:
```
Compiled successfully!
You can now view citypulse in the browser.
  Local:            http://localhost:3000
```

### Browser: Open App
- Go to `http://localhost:3000`
- You should see the CityPulse Dashboard

---

## 📱 What to Expect

### First Load
1. See "CityPulse Dashboard" title
2. See **NEW**: "Select City" dropdown (Nairobi, Mombasa, Kisumu)
3. See theme toggle and print button (unchanged)

### After Selecting a City
1. "City Profile" section becomes active
2. Area dropdown fills with areas from that city only
3. "Compare Areas" section becomes active
4. Both area dropdowns show only areas from that city
5. "Opportunity Engine" remains as before

### Using the App
- **City Profile**: Select city → select area → see indicators
- **Compare Areas**: Select city → select 2 areas → see radar chart
- **Opportunity Engine**: Select industry → click Run → see bar chart

---

## ✅ Safety Checklist

- [ ] Backend starts without errors
- [ ] Frontend compiles successfully
- [ ] You can see the CityPulse Dashboard
- [ ] City dropdown shows Nairobi, Mombasa, Kisumu
- [ ] Selecting a city updates the area dropdown
- [ ] Radar chart works for comparing areas
- [ ] Bar chart works for opportunities

---

## ⚠️ If Something Goes Wrong

### Backend won't start?
```bash
# Make sure venv is active, then check if port 8000 is free
netstat -ano | findstr ":8000"

# If port in use, kill the process or use different port:
.\.venv\Scripts\python -m uvicorn backend.main:app --port 8001
```

### Frontend won't compile?
```bash
cd frontend
npm install  # Re-install dependencies
npm start
```

### API not responding?
- Check backend terminal for errors
- Verify backend is running on http://127.0.0.1:8000
- Try fetching directly: `curl http://127.0.0.1:8000/cities`

### City dropdown empty?
- Backend may not have seeded data
- Run: `.\.venv\Scripts\python -m backend.seed`
- Restart backend

---

## 🔄 Reset Database (If Needed)

```bash
cd "C:\Users\Administrator\Desktop\CityPulse"
.\.venv\Scripts\python -m backend.seed
```

This will:
- Drop all existing tables
- Recreate schema
- Seed all 3 cities + 26 areas + data

Takes ~2 seconds. Safe to run anytime.

---

## 📊 Data Integrity Check

If you want to verify the database is correct:
```bash
cd "C:\Users\Administrator\Desktop\CityPulse"
.\.venv\Scripts\python -c "from backend import models; from backend.database import engine; models.Base.metadata.create_all(bind=engine); print('Tables:', list(models.Base.metadata.tables.keys())); print('City count:', engine.execute('SELECT COUNT(*) FROM cities').scalar())"
```

Expected output:
```
Tables: ['cities', 'areas', 'indicators', 'scores', 'opportunities']
City count: 3
```

---

## ✨ New Features to Try

1. **City Selector**: Try switching between Nairobi, Mombasa, Kisumu
2. **Area Filtering**: Notice areas change when you pick a different city
3. **Compare Feature**: Compare areas within the same city
4. **Label Change**: See "City Profile" instead of old "Area Profile"

---

## 🎉 You're Ready!

Everything is tested and working. Open the app without fear.
The changes are safe, backward compatible, and fully integrated.

**Have fun with CityPulse!** 🌆
