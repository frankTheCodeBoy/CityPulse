# 🚀 Deployment Guide for CityPulse

A comprehensive guide to deploy CityPulse to production environments. Choose the platform that fits your needs.

---

## 📋 Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Heroku (Easiest)](#heroku-easiest)
3. [Render.com (Recommended)](#rendercom-recommended)
4. [Railway.app (Simple)](#railwayapp-simple)
5. [Docker + Vercel](#docker--vercel)
6. [AWS EC2 (Full Control)](#aws-ec2-full-control)
7. [DigitalOcean App Platform](#digitalocean-app-platform)
8. [Post-Deployment](#post-deployment)

---

## ✅ Pre-Deployment Checklist

### Code Quality
- [ ] All Python files pass flake8 (`flake8 backend/`)
- [ ] Frontend builds without warnings (`npm run build`)
- [ ] No console errors in dev (`npm start`)
- [ ] API endpoints tested locally
- [ ] Database seeds properly (`python -m backend.seed`)

### Environment Setup
- [ ] `.env.example` file created
- [ ] Sensitive variables documented
- [ ] Database connection strings configured
- [ ] CORS origins updated for production domain

### Database
- [ ] Switch to PostgreSQL (not SQLite)
- [ ] Database backup strategy planned
- [ ] Migration scripts prepared (if using Alembic)
- [ ] Seed data archived

### Performance
- [ ] Frontend optimized (`npm run build`)
- [ ] API response times < 500ms
- [ ] Database indexes added on `city_id`, `area_id`
- [ ] Static files compressed

### Security
- [ ] No secrets in code/git
- [ ] HTTPS enforced
- [ ] API rate limiting enabled
- [ ] Input validation on endpoints
- [ ] CORS properly scoped

---

## 🎯 Heroku (Easiest)

**Best for**: Quick MVP deployment, free tier available

### Step 1: Prepare Project

1. **Create Procfile** (`Procfile` in project root)
   ```
   web: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
   release: python -m backend.seed
   ```

2. **Create .gitignore**
   ```
   .venv/
   __pycache__/
   *.db
   .env
   node_modules/
   ```

3. **Create .env.production**
   ```
   DATABASE_URL=postgresql://user:pass@host/citypulse
   ENVIRONMENT=production
   CORS_ORIGINS=https://your-app.herokuapp.com
   ```

### Step 2: Deploy

1. **Install Heroku CLI**
   ```bash
   # Visit heroku.com/cli or use:
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create app**
   ```bash
   heroku create citypulse-prod
   ```

4. **Add PostgreSQL add-on**
   ```bash
   heroku addons:create heroku-postgresql:standard-0
   ```

5. **Set environment variables**
   ```bash
   heroku config:set ENVIRONMENT=production
   heroku config:set CORS_ORIGINS=https://citypulse-prod.herokuapp.com
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

7. **Run migrations**
   ```bash
   heroku run python -m backend.seed
   ```

### Step 3: Verify

```bash
heroku open
heroku logs -t  # tail logs
```

**Pros**: Easy, free tier, auto-scaling, automatic HTTPS  
**Cons**: Not free tier as of Nov 2022, limited customization

---

## 🎨 Render.com (Recommended)

**Best for**: Modern deployment, free tier, easy dashboard

### Step 1: Prepare Repository

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/citypulse.git
   git push -u origin main
   ```

2. **Create `render.yaml`** (in project root)
   ```yaml
   services:
     - type: web
       name: citypulse-backend
       env: python
       plan: free
       buildCommand: pip install -r requirements.txt
       startCommand: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
       envVars:
         - key: DATABASE_URL
           value: ${{ env("DATABASE_URL") }}
     
     - type: static_site
       name: citypulse-frontend
       buildCommand: cd frontend && npm install && npm run build
       staticPublishPath: frontend/build
       routes:
         - path: /api
           destination: http://localhost:8000
   
   databases:
     - name: citypulse-db
       dbName: citypulse
       user: postgres
       plan: free
   ```

### Step 2: Deploy via Dashboard

1. **Go to render.com and sign up**
2. **Connect GitHub account**
3. **Select this repository**
4. **Create web service**
   - Name: `citypulse-backend`
   - Environment: Python
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - Plan: Free (or Paid)

5. **Create database**
   - PostgreSQL
   - Add connection URL as `DATABASE_URL` env variable

6. **Create static site for frontend**
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/build`

### Step 3: Post-Deploy

```bash
# Get backend URL from Render dashboard
# Update frontend to use production API URL

# Update CORS in backend/main.py
# Update API endpoint in frontend/src/App.js
```

**Pros**: Free tier, easy GitHub integration, PostgreSQL included, good dashboard  
**Cons**: Free tier sleeps after 15 min inactivity

---

## 🚂 Railway.app (Simple)

**Best for**: Simple setup, generous free tier

### Step 1: Login & Connect

1. **Sign up at railway.app**
2. **Connect GitHub account**
3. **Create new project**

### Step 2: Add Services

1. **Add PostgreSQL**
   - Click "Add Service" → PostgreSQL
   - Copy connection string

2. **Add Backend**
   - Select your GitHub repo
   - Environment: Python
   - Start command: `uvicorn backend.main:app --host 0.0.0.0`
   - Add `DATABASE_URL` from PostgreSQL

3. **Add Frontend**
   - Build command: `cd frontend && npm run build`
   - Start command: `npm start` (or use Static service)

### Step 3: Configure Environment

```bash
# In Railway dashboard, set:
DATABASE_URL = <postgres-connection-string>
ENVIRONMENT = production
CORS_ORIGINS = https://your-railway-domain.railway.app
```

**Pros**: Simple, generous free tier, good documentation  
**Cons**: Less mature than Render

---

## 🐳 Docker + Vercel

**Best for**: Full control, container-based deployment

### Step 1: Create Docker Files

**`Dockerfile.backend`** (in backend/)
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**`Dockerfile.frontend`** (in frontend/)
```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
```

**`docker-compose.yml`** (in project root)
```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: citypulse
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secretpassword
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    environment:
      DATABASE_URL: postgresql://postgres:secretpassword@db:5432/citypulse
      CORS_ORIGINS: http://localhost:3000
    ports:
      - "8000:8000"
    depends_on:
      - db

  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Step 2: Build & Run

```bash
docker-compose up -d
docker-compose logs -f
```

### Step 3: Deploy to Cloud

**Option A: Docker Hub → AWS, GCP, Azure**
```bash
docker build -t yourusername/citypulse-backend -f backend/Dockerfile .
docker push yourusername/citypulse-backend
# Then deploy from any cloud provider's container registry
```

**Option B: Vercel + Render**
- Deploy backend to Render (supports Docker)
- Deploy frontend to Vercel (free tier)

**Pros**: Full control, reproducible environments, easy scaling  
**Cons**: Requires Docker knowledge

---

## ☁️ AWS EC2 (Full Control)

**Best for**: High scalability, custom requirements

### Step 1: Launch EC2 Instance

1. **Go to AWS Console → EC2**
2. **Launch instance**
   - AMI: Ubuntu 22.04 LTS
   - Instance type: t3.micro (free tier) or t3.small
   - Security group: Allow HTTP (80), HTTPS (443), SSH (22)

3. **Allocate Elastic IP** (static public IP)

### Step 2: Install Dependencies

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-public-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Python
sudo apt install python3 python3-pip python3-venv -y

# Install Node
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install Git
sudo apt install git -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y
```

### Step 3: Clone & Setup

```bash
cd /var/www
sudo git clone https://github.com/yourusername/citypulse.git
cd citypulse
sudo chown -R $USER:$USER .

# Backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
npm run build
```

### Step 4: Configure Services

**Gunicorn + Systemd for Backend** (`/etc/systemd/system/citypulse.service`)
```ini
[Unit]
Description=CityPulse Backend
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/var/www/citypulse
Environment="PATH=/var/www/citypulse/.venv/bin"
ExecStart=/var/www/citypulse/.venv/bin/gunicorn \
  -w 4 \
  -b 127.0.0.1:8000 \
  "backend.main:app"

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable citypulse
sudo systemctl start citypulse
```

**Nginx Reverse Proxy** (`/etc/nginx/sites-available/citypulse`)
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static {
        alias /var/www/citypulse/frontend/build;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/citypulse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

**Pros**: Full control, scalable, cost-effective  
**Cons**: Requires DevOps knowledge

---

## 🌊 DigitalOcean App Platform

**Best for**: Balanced simplicity & control

1. **Connect GitHub repo** to DigitalOcean
2. **Create app from spec**
3. **Add PostgreSQL database**
4. **Deploy** — automatically builds and deploys

---

## ✅ Post-Deployment

### Verify Deployment

```bash
# Test backend
curl https://your-domain.com/cities
# Should return: [{"id":1,"name":"Nairobi"}, ...]

# Test frontend
curl https://your-domain.com
# Should return HTML
```

### Database Seeding

```bash
# SSH into production server or use deployment shell
python -m backend.seed
```

### Monitoring & Logging

- **Heroku**: `heroku logs -t`
- **Render**: Dashboard logs
- **AWS**: CloudWatch logs
- **DigitalOcean**: App logs in dashboard

### Setup SSL Certificate

- **Heroku**: Auto (included)
- **Render**: Auto (included)
- **Railway**: Auto (included)
- **AWS EC2**: Let's Encrypt (free)

### Update CORS

Update `backend/main.py`:
```python
allow_origins=[
    "https://your-production-domain.com",
    "https://www.your-production-domain.com",
]
```

### Environment Variables

Set these in your deployment platform:

```
DATABASE_URL = postgresql://user:pass@host/citypulse
ENVIRONMENT = production
CORS_ORIGINS = https://your-domain.com
```

---

## 🎯 Recommended Path for Job Applicants

For showcasing your full-stack skills:

1. **Use Render.com** (Backend + DB)
   - Free, professional, includes PostgreSQL
   - Demonstrates cloud deployment
   
2. **Use Vercel** (Frontend)
   - Free, industry-standard
   - Shows modern frontend deployment
   
3. **Use GitHub** for version control
   - Public repo shows professionalism
   - Commit history demonstrates development process

**Final URLs to put on resume**:
- Frontend: `https://citypulse.vercel.app`
- Backend API: `https://citypulse-backend.onrender.com`
- GitHub: `https://github.com/yourusername/citypulse`

---

## 🆘 Troubleshooting

### Backend not starting
```bash
# Check logs
heroku logs -t  # or equivalent for your platform

# Common issues:
# - Missing environment variables
# - Database connection string wrong
# - Missing dependencies in requirements.txt
```

### Frontend can't reach backend
```bash
# Check CORS in backend/main.py
# Update API endpoint in frontend/src/App.js
# Verify backend URL is accessible
```

### Database connection errors
```bash
# Test connection
psql postgresql://user:pass@host/citypulse

# Check DATABASE_URL format:
# postgresql://username:password@hostname:port/database_name
```

### Build fails
```bash
# Clear cache and retry
# Check for missing dependencies
# Verify file permissions
```

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app
- **Heroku Docs**: https://devcenter.heroku.com
- **AWS Docs**: https://docs.aws.amazon.com

---

**Last Updated**: 2024  
**Status**: ✅ Production Ready
