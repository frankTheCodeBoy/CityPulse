# CityPulse 🌆 — Urban Intelligence Platform

A **data engineering and analytics project** demonstrating full‑stack capabilities for metropolitan area analysis.  
CityPulse ingests, processes, and visualizes urban indicators across multiple cities to support business decision‑making.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Tests](https://github.com/frankTheCodeBoy/CityPulse/actions/workflows/tests.yml/badge.svg)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)
![SQLAlchemy](https://img.shields.io/badge/ORM-SQLAlchemy-FCA121)
![License](https://img.shields.io/badge/License-MIT-blue)

🔗 **Live Demo**: [CityPulse Dashboard](https://city-pulse-beta.vercel.app)  
🔗 **Backend Health Check**: [API /healthz](https://citypulse-backend-bg9v.onrender.com/healthz)  
🔗 **Repository**: [GitHub Repo](https://github.com/frankTheCodeBoy/CityPulse)

---

## 📋 Table of Contents
- [Vision & Purpose](#vision--purpose)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Infrastructure](#infrastructure)
- [Architecture](#architecture)
- [Data Model](#data-model)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Data Engineering Highlights](#data-engineering-highlights)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## 🎯 Vision & Purpose
**CityPulse** is a flagship urban analytics platform designed for:
- **Business Intelligence**: Identify high‑opportunity areas for business expansion  
- **Urban Planning**: Analyze metropolitan growth patterns and infrastructure metrics  
- **Data Engineering Portfolio**: Showcase ETL pipelines, multi‑database hierarchies, and real‑time analytics  

---

## ✨ Features
- 🏙️ Multi‑City Hierarchy (Nairobi, Mombasa, Kisumu)  
- 📊 Analytics Engine (City Profile, Area Comparison, Opportunity Engine)  
- 🎨 Adaptive Dark/Light Theme, PDF Export, Mobile Responsive  

---

## 🛠️ Tech Stack
- **Backend**: FastAPI, SQLAlchemy, SQLite/Postgres  
- **Frontend**: React, Material‑UI, Recharts  
- **Infrastructure**: npm, pip, Docker‑ready  

---

## 🏗️ Architecture
```
┌──────────────────┐
│   React Frontend │
│   (Port 3000)    │
└────────┬─────────┘
         │ HTTP/JSON
         ▼
┌──────────────────┐
│   FastAPI Server │
│   (Port 8000)    │
└────────┬─────────┘
         │ SQLAlchemy
         ▼
┌──────────────────┐
│   SQLite/Postgres│
│   (Database)     │
└──────────────────┘
```

---

## 📊 Data Model
Entities: **Cities → Areas → Indicators → Scores → Opportunities**  
Supports hierarchical filtering and computed indices (Health Score, Growth Index, Infra Index, Opportunity Score).  

---

## 🚀 Installation
### Backend
```bash
git clone https://github.com/frankTheCodeBoy/CityPulse.git
cd CityPulse
python -m venv .venv
source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
python -m backend.seed
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```
Backend available at: `http://127.0.0.1:8000`

### Frontend
```bash
cd frontend
npm install
npm start
```
Frontend available at: `http://localhost:3000`

---

## 💻 Usage
- **Backend**: `uvicorn backend.main:app --reload`  
- **Frontend**: `npm start`  
- Browser: `http://localhost:3000`  

Interactive walkthrough: city selection, profiles, comparisons, opportunity engine.  

---

## 🐳 Deployment
- **Docker Compose** (recommended)  
- Cloud options: Heroku, Render, AWS EC2+RDS, Vercel+Railway.  
- Environment variables via `.env`.  

---

## 📂 Project Structure
```
citypulse/
├── backend/
│   ├── main.py              # FastAPI app + endpoints
│   ├── models.py            # SQLAlchemy ORM models
│   ├── database.py          # DB engine + session config
│   ├── seed.py              # Data seeding script
│   └── citypulse.db         # SQLite (local dev)
│
├── frontend/
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   ├── App.css          # Styling
│   │   ├── index.js         # Entry point
│   │   └── mockData.js      # Fallback data
│   ├── package.json         # Dependencies
│   └── public/
│
├── docs/
│   └── developer-docs.md    # Architecture docs
│
├── .env.example             # Environment template
├── requirements.txt         # Python dependencies
├── README.md                # This file
└── docker-compose.yml       # Container orchestration
```

---

## 🔌 API Endpoints
- `GET /cities`  
- `GET /areas/{city_id}`  
- `GET /area-profile/{area_id}`  
- `GET /compare-areas?area1&area2`  
- `POST /opportunity-engine`  
- `GET /industries`  

---

## 🎓 Data Engineering Highlights
- ⚙️ ETL pipeline with seed script  
- 🗄️ Hierarchical DB design  
- 🌐 RESTful API development  
- 📐 Normalized scoring + opportunity ranking  
- ⚡ Async FastAPI backend  
- 🎨 React frontend integration  

---

## 📈 Future Roadmap
- Phase 2: Advanced Analytics (time‑series, ML, LLM summaries)  
- Phase 3: Data Infrastructure (PostGIS, Airflow, warehouse)  
- Phase 4: Scale & Performance (Redis, rate limiting, load testing)  
- Phase 5: Enterprise Features (auth, dashboards, API keys)  

---

## 🤝 Contributing
1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/amazing-feature`)  
3. Commit changes (`git commit -m 'Add amazing feature'`)  
4. Push to branch (`git push origin feature/amazing-feature`)  
5. Open a Pull Request  

---

## 📝 License
MIT License © 2026 Frank Olum  

---

## 👤 Author

**Frank Olum** — Analytics Engineer & Full‑Stack Developer  

- 🐙 GitHub: [frankTheCodeBoy](https://github.com/frankTheCodeBoy)  
- 💼 LinkedIn: [Frank Olum](https://www.linkedin.com/in/francis-olum-tech)  


---
