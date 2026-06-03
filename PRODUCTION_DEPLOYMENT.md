# 🚀 Production Deployment Guide — Render + Neon + Vercel

---

## ✅ Your Deployment Architecture

```
CityPulse Production Stack (FREE tier, no credit card required)

┌─────────────────────────────────────────────────────────┐
│  Frontend (React)                                       │
│  Deployed on: Vercel (or Cloudflare Pages)             │
│  URL: https://citypulse.vercel.app                     │
│  Uptime: Always on, no sleep                           │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTPS REST API calls
                   ▼
┌─────────────────────────────────────────────────────────┐
│  Backend (FastAPI)                                      │
│  Deployed on: Render.com Web Service (free)            │
│  URL: https://citypulse-backend.onrender.com           │
│  Uptime: Sleeps after 15 min idle, auto-wakes          │
└──────────────────┬──────────────────────────────────────┘
                   │ SQLAlchemy ORM
                   ▼
┌─────────────────────────────────────────────────────────┐
│  Database (PostgreSQL)                                  │
│  Hosted on: Neon.tech (serverless Postgres)            │
│  Connection: Persistent, no sleep                       │
│  Plan: Free tier                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 What Was Generated

### Backend Files
- ✅ `Dockerfile` — Production container for FastAPI
- ✅ `backend/main.py` — Updated with production CORS
- ✅ `backend/database.py` — PostgreSQL + NullPool config
- ✅ `render.yaml` — Render deployment config
- ✅ `.env.example` — Environment variables template
- ✅ `.env.production` — Production API URL

### Frontend Files
- ✅ `.env.production` — API base URL for Vercel

### Verification
- ✅ All backend code passes flake8 (PEP8 compliant)
- ✅ All dependencies in requirements.txt
- ✅ Docker build optimized for Render

---

## 🛠️ Step-by-Step Deployment

### Phase 1: Setup Neon PostgreSQL Database (5 min)

1. **Create Neon Account**
   - Go to https://console.neon.tech/
   - Sign up (free, no credit card)
   - Create new project "citypulse"

2. **Create Database**
   - Database name: `citypulse`
   - User: (Neon auto-generates)
   - Password: (Neon auto-generates)

3. **Copy Connection String**
   - From Neon dashboard, copy the PostgreSQL connection string
   - Format: `postgresql://user:[REDACTED]@host:port/citypulse`
   - **Keep this safe** — you'll need it for Render

4. **Add ?sslmode=require to Connection String**
   - Neon requires SSL, so append: `?sslmode=require`
   - Final format: `postgresql://user:[REDACTED]@host:port/citypulse?sslmode=require`

---

### Phase 2: Deploy Backend to Render (20 min)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up (free, no credit card)
   - Connect your GitHub account

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo (frankTheCodeBoy/citypulse)
   - Select main branch
   - Name: `citypulse-backend`
   - Region: (closest to users, e.g., Ohio for US)

3. **Build & Start Commands**
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables**
   - Add environment variable:
     - Key: `DATABASE_URL`
     - Value: (Your Neon connection string from Phase 1)
   - Add environment variable:
     - Key: `ENVIRONMENT`
     - Value: `production`

5. **Pricing Plan**
   - Select: **Free** (auto-deploys)
   - Note: Free tier sleeps after 15 min inactivity

6. **Deploy**
   - Click "Create Web Service"
   - Wait for build + deploy (3-5 min)
   - When live, copy your Render URL: `https://citypulse-backend-XXXX.onrender.com`

7. **Seed Database**
   - In Render dashboard, click "Shell"
   - Run: `python -m backend.seed`
   - Should complete without errors

---

### Phase 3: Deploy Frontend to Vercel (15 min)

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up (free, no credit card)
   - Connect your GitHub account

2. **Import Project**
   - Click "New Project"
   - Select `citypulse` GitHub repo
   - Framework: "Create React App"
   - Root directory: `./frontend`

3. **Build Settings**
   - Build command: `npm run build`
   - Output directory: `build`

4. **Environment Variables**
   - Add environment variable:
     - Key: `REACT_APP_API_URL`
     - Value: `https://citypulse-backend-XXXX.onrender.com` (your Render URL)

5. **Deploy**
   - Click "Deploy"
   - Wait for build + deploy (2-3 min)
   - When live, you'll get: `https://citypulse.vercel.app`

---

### Phase 4: Update Backend CORS (2 min)

1. **Update CORS in backend/main.py**
   ```python
   PRODUCTION_ORIGINS = [
       "https://citypulse.vercel.app",
       "https://citypulse.pages.dev",
   ]
   ```
   (Already done for you!)

2. **Push to GitHub**
   ```bash
   git add backend/main.py
   git commit -m "chore: update production CORS origins"
   git push origin main
   ```

3. **Render Auto-Redeploys**
   - Render watches your GitHub repo
   - Changes automatically deploy (~2 min)

---

### Phase 5: Verify Deployment (5 min)

1. **Test Backend API**
   - Visit: `https://citypulse-backend-XXXX.onrender.com/cities`
   - Should return JSON with 3 cities

2. **Test Frontend**
   - Visit: `https://citypulse.vercel.app`
   - Should load dashboard
   - Select a city → should fetch areas from backend
   - Select an area → should display metrics

3. **Check Network Tab**
   - Open DevTools (F12)
   - Go to Network tab
   - Select a city
   - Verify API call to `citypulse-backend-XXXX.onrender.com/areas/{city_id}`
   - Status should be 200 (success)

4. **Test All Features**
   - [ ] City selector works
   - [ ] Area filtering works
   - [ ] City Profile displays metrics
   - [ ] Compare Areas shows radar chart
   - [ ] Opportunity Engine shows bar chart
   - [ ] Theme toggle works (light/dark)
   - [ ] PDF export works
   - [ ] Your footer displays with GitHub link
   - [ ] Footer link opens your GitHub

---

## 🎯 Final URLs

### For Your Resume/Portfolio
```
Frontend: https://citypulse.vercel.app
Backend API: https://citypulse-backend-XXXX.onrender.com
GitHub: https://github.com/frankTheCodeBoy/citypulse
```

### Environment Variables Used
```
ENVIRONMENT=production
DATABASE_URL=postgresql://user:[REDACTED]@your-neon-host.neon.tech:5432/citypulse?sslmode=require
REACT_APP_API_URL=https://citypulse-backend-XXXX.onrender.com
```

---

## ⚠️ Important Notes

### Render Free Tier Behavior
- ✅ Always available (no payment required)
- ⚠️ Spins down after 15 min of inactivity
- ⚠️ First request after sleep takes 30-60 sec (cold start)
- ✅ Can upgrade to paid tier anytime (then runs 24/7)

### Neon Free Tier Limits
- ✅ 3 projects included
- ✅ Storage: 3 GB per project
- ✅ Always available (no sleep)
- ✅ Perfect for portfolio projects

### Vercel Free Tier
- ✅ Always available (no sleep)
- ✅ Unlimited deployments
- ✅ Built-in HTTPS
- ✅ Global CDN included

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push
1. Make changes to code
2. Commit and push to GitHub
3. Render automatically rebuilds and redeploys
4. Vercel automatically rebuilds and redeploys
5. Live within 2-5 minutes

### Manual Redeploy
- **Render**: Dashboard → Manual deploy
- **Vercel**: Dashboard → Redeploy

---

## ✅ Deployment Checklist

- [ ] Neon PostgreSQL database created
- [ ] Database connection string copied
- [ ] Render backend deployed
- [ ] Backend seeded with `python -m backend.seed`
- [ ] Render backend URL verified (GET /cities works)
- [ ] Vercel frontend deployed
- [ ] Frontend API URL environment variable set
- [ ] Frontend loads and fetches from backend
- [ ] All features tested (city, areas, charts, PDF)
- [ ] Your footer displays correctly
- [ ] GitHub link from footer works
- [ ] URLs added to resume/portfolio

---

## 📞 Troubleshooting

### "Failed to load cities" error
**Cause**: Frontend can't reach backend API
**Fix**:
1. Verify Render backend is running (Dashboard → Logs)
2. Verify `REACT_APP_API_URL` is set correctly in Vercel
3. Check CORS: verify frontend URL in backend `PRODUCTION_ORIGINS`
4. Wait 2-3 min for Render auto-redeploy after code changes

### Backend returns 503 Service Unavailable
**Cause**: Render free tier is cold-starting (first request after sleep)
**Fix**:
1. Wait 30-60 seconds and try again
2. Can upgrade to paid tier to eliminate sleep

### Database connection timeout
**Cause**: Neon connection string incorrect or network issue
**Fix**:
1. Verify `DATABASE_URL` env variable is set
2. Verify connection string includes `?sslmode=require`
3. Check Neon dashboard for database status

### "CORS error" in browser console
**Cause**: Frontend URL not in backend CORS list
**Fix**:
1. Add your Vercel URL to `PRODUCTION_ORIGINS` in backend/main.py
2. Push to GitHub (Render auto-redeploys)

---

## 🎉 You're Live!

Your production CityPulse app is now deployed with:
- ✅ Frontend on Vercel (always up)
- ✅ Backend on Render (free tier)
- ✅ Database on Neon (always up)
- ✅ Your name in the footer
- ✅ GitHub link from the app

**Share your URLs:**
- Demo: `https://citypulse.vercel.app`
- GitHub: `https://github.com/frankTheCodeBoy/citypulse`

**Add to your resume:**
- CityPulse Urban Intelligence Platform
- Live Demo: https://citypulse.vercel.app
- GitHub: https://github.com/frankTheCodeBoy/citypulse
- Deployed on: Vercel (frontend), Render (backend), Neon (database)

---

**Built with ♥ by Francis Olum (frankTheCodeBoy)**
**CityPulse © 2024-2026 — Urban Intelligence Analytics**
