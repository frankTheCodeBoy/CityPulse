# ✅ RENDER DEPLOYMENT SETUP — Francis Olum

**Status**: Ready for Render deployment ✅

---

## 🎯 What's Ready

### Backend Code ✅
- `/healthz` endpoint added (Render health check)
- CORS configured for production
- PostgreSQL pooling optimized
- Dockerfile ready
- All code PEP8 compliant

### Git Status ✅
- All changes committed to GitHub
- Repo synced and ready
- Latest commit: "chore: add /healthz endpoint for Render health check"

---

## 🚀 Render Deployment Checklist

### Phase 1: Setup Neon PostgreSQL (5 min)
```
1. Go to https://console.neon.tech/
2. Sign up (free, no credit card)
3. Create database "citypulse"
4. Copy connection string: postgresql://user:[REDACTED]@host:5432/citypulse?sslmode=require
5. Keep it safe for Render setup
```

### Phase 2: Deploy Backend to Render (20 min)

1. **Create Render Account**
   - https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub → select `citypulse` repo
   - Branch: `main`
   - Root directory: leave blank

3. **Configure Service**
   ```
   Name: citypulse-backend
   Environment: Docker
   Plan: Free
   ```

4. **Docker Settings**
   ```
   Dockerfile path: ./Dockerfile
   Start command: (leave blank — Dockerfile handles it)
   ```

5. **Environment Variables**
   - Key: `DATABASE_URL`
     Value: (Your Neon PostgreSQL connection string from Phase 1)
   - Key: `ENVIRONMENT`
     Value: `production`

6. **Health Check**
   ```
   Path: /healthz
   Check Interval: 30s
   Timeout: 5s
   ```

7. **Deploy**
   - Click "Create Web Service"
   - Wait 3-5 minutes for build + deploy
   - When live, copy your URL: `https://citypulse-backend-XXXX.onrender.com`

8. **Seed Database**
   - In Render dashboard: Click "Shell"
   - Run: `python -m backend.seed`
   - Should see: "Cities, Areas, Indicators, Scores, and Opportunities seeded!"

---

## ✅ Health Check Endpoint

Your backend now has:
```
GET /healthz
Response: {"status": "ok"}
```

This is what Render uses to monitor your service health. It's lightweight and doesn't require database access.

---

## 🎯 Render Dashboard Settings Reference

| Setting | Value |
|---------|-------|
| Name | citypulse-backend |
| Environment | Docker |
| Plan | Free ($0/month) |
| Instance Type | Standard |
| Auto-Deploy | Enabled |
| Health Check Path | /healthz |
| Dockerfile | ./Dockerfile |
| Start Command | (blank) |

---

## 🔗 Your Render URLs

After deployment:
- **Service URL**: `https://citypulse-backend-XXXX.onrender.com`
- **Health Check**: `https://citypulse-backend-XXXX.onrender.com/healthz`
- **API**: `https://citypulse-backend-XXXX.onrender.com/cities`

---

## ⏱️ Expected Timeline

| Step | Time | Status |
|------|------|--------|
| Neon setup | 5 min | ⏳ Next |
| Render setup | 5 min | ⏳ Next |
| Build & deploy | 5-10 min | ⏳ Next |
| Health check pass | 2-3 min | ⏳ Next |
| Database seed | 2 min | ⏳ Next |
| Verification | 3 min | ⏳ Next |
| **Total** | **~25 min** | ⏳ Ready |

---

## ✨ What's Already Done

✅ `/healthz` endpoint coded  
✅ Pushed to GitHub  
✅ PEP8 compliant  
✅ Dockerfile ready  
✅ CORS configured  
✅ Database pooling setup  
✅ Environment variables defined  

**You're ready to fill out the Render form!**

---

## 🎯 Next Steps

1. Read this guide
2. Set up Neon PostgreSQL (get connection string)
3. Go to Render and create Web Service
4. Fill in settings as shown above
5. Deploy
6. Seed database
7. Verify health check works

---

## 📞 Test Your Render Deployment

Once live, test these endpoints:

```bash
# Health check (should return 200 + {"status": "ok"})
curl https://citypulse-backend-XXXX.onrender.com/healthz

# Cities endpoint (should return JSON with cities)
curl https://citypulse-backend-XXXX.onrender.com/cities

# Industries (should return ["Food", "Tech", "Retail"])
curl https://citypulse-backend-XXXX.onrender.com/industries
```

---

**You're deployment-ready! Follow the checklist above. 🚀**

Built with ♥ by Francis Olum (frankTheCodeBoy)
