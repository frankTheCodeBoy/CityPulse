# CityPulse: Urban Intelligence Platform 🌆

A **data engineering and analytics project** demonstrating full-stack capabilities for metropolitan area analysis. CityPulse ingests, processes, and visualizes urban indicators across multiple cities to support business decision-making.

![CityPulse Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)
![SQLAlchemy](https://img.shields.io/badge/ORM-SQLAlchemy-FCA121)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 📋 Table of Contents
- [Vision & Purpose](#vision--purpose)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Data Model](#data-model)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Data Engineering Highlights](#data-engineering-highlights)
- [Future Roadmap](#future-roadmap)

---

## 🎯 Vision & Purpose

**CityPulse** is a flagship urban analytics platform designed for:
- **Business Intelligence**: Identify high-opportunity areas for business expansion
- **Urban Planning**: Analyze metropolitan growth patterns and infrastructure metrics
- **Data Engineering Portfolio**: Showcase ETL pipelines, multi-database hierarchies, and real-time analytics

### Use Cases
1. **Investor Analysis**: Find optimal business locations by city and area
2. **Urban Metrics**: Track population, mobility, environment, and infrastructure scores
3. **Comparative Analysis**: Compare neighborhoods across multiple dimensions
4. **Opportunity Scoring**: Rank areas by industry-specific business potential

---

## ✨ Features

### 🏙️ Multi-City Hierarchy
- **3 Metropolitan Areas**: Nairobi, Mombasa, Kisumu
- **26 Neighborhoods**: Dynamically loaded based on city selection
- **Hierarchical Filtering**: City → Area → Detailed Metrics

### 📊 Analytics Engine
1. **City Profile** — Deep-dive into neighborhood metrics
   - Population demographics
   - Mobility Score (0-1)
   - Environment Quality Score
   - Infrastructure Index
   - Business Activity Potential
   
2. **Area Comparison** — Radar chart comparison
   - Side-by-side metric visualization
   - 5-dimension analysis
   - Normalized scoring
   
3. **Opportunity Engine** — Industry-based ranking
   - Food, Tech, Retail industries
   - Area opportunity scoring
   - Bar chart rankings

### 🎨 User Experience
- **Adaptive Dark/Light Theme** — Professional color gradients
- **Real-time Data Fetching** — Responsive loading states
- **Export to PDF** — Dashboard capture for reporting
- **Mobile Responsive** — Works on desktop and tablet

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (async Python web framework)
- **ORM**: SQLAlchemy (database abstraction)
- **Database**: SQLite (development), PostgreSQL (production-ready)
- **API**: RESTful endpoints with CORS support

### Frontend
- **Framework**: React 18+ (UI library)
- **Styling**: Material-UI (component library)
- **Charts**: Recharts (data visualization)
- **HTTP**: Fetch API (native browser HTTP)
- **Export**: html2canvas + jsPDF

### Infrastructure
- **Package Management**: npm (frontend), pip (backend)
- **Environment**: Python 3.8+, Node.js 14+
- **Deployment**: Docker-ready (see below)

---

## 🏗️ Architecture

### System Diagram
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

### Data Flow
1. **User selects city** → Frontend fetches `/cities` endpoint
2. **Frontend loads areas** → Fetches `/areas/{city_id}`
3. **User selects area** → Fetches `/area-profile/{area_id}`
4. **Backend queries** → SQLAlchemy ORM joins Indicator, Score, Opportunity tables
5. **Response sent** → JSON serialized and rendered on dashboard

---

## 📊 Data Model

### Entity Relationship Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                        DATABASE SCHEMA                       │
└─────────────────────────────────────────────────────────────┘

CITIES (1)
  ├─ id (PK)
  ├─ name (UNIQUE)
  └─ areas (relationship)

AREAS (26 total)
  ├─ id (PK)
  ├─ name
  ├─ city_id (FK → CITIES)
  ├─ indicators (relationship)
  ├─ scores (relationship)
  └─ City (back_populates)

INDICATORS
  ├─ id (PK)
  ├─ area_id (FK → AREAS)
  ├─ population
  ├─ mobility_score
  ├─ environment_score
  ├─ infrastructure_score
  └─ business_activity_score

SCORES
  ├─ id (PK)
  ├─ area_id (FK → AREAS)
  ├─ health_score (computed)
  ├─ growth_index
  ├─ infra_index
  └─ opportunity_score

OPPORTUNITIES
  ├─ id (PK)
  ├─ area (string reference)
  ├─ industry (Food | Tech | Retail)
  └─ opportunity_score
```

### Data Hierarchy
```
NAIROBI (14 areas)
  ├─ CBD, Westlands, Kilimani, Karen, Ruiru
  ├─ Kibera, Dagoretti, Embakasi, Kasarani
  └─ Upperhill, Lavington, South B, South C, Mathare

MOMBASA (6 areas)
  ├─ Nyali, Likoni, Bamburi, Changamwe
  └─ Kisauni, Shanzu

KISUMU (6 areas)
  ├─ Kondele, Manyatta, Nyalenda, Milimani
  └─ Obunga, Kibuye
```

---

## 🚀 Installation

### Prerequisites
- Python 3.8+ with pip
- Node.js 14+ with npm
- Git

### Backend Setup

1. **Clone and navigate**
   ```bash
   git clone https://github.com/yourusername/citypulse.git
   cd citypulse
   ```

2. **Create virtual environment**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   source .venv/bin/activate  # macOS/Linux
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Seed database**
   ```bash
   python -m backend.seed
   ```
   Expected output:
   ```
   Resetting database...
   Database reset complete.
   Cities, Areas, Indicators, Scores, and Opportunities seeded!
   ```

5. **Start backend server**
   ```bash
   python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
   ```
   Backend available at: `http://127.0.0.1:8000`

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   Frontend available at: `http://localhost:3000`

---

## 💻 Usage

### Local Development

**Terminal 1 — Backend**
```bash
cd citypulse
.venv\Scripts\activate
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

**Terminal 2 — Frontend**
```bash
cd citypulse/frontend
npm start
```

**Open Browser**
- Navigate to `http://localhost:3000`
- Select a city, explore areas, analyze opportunities

### Interactive Walkthrough

1. **City Selection**
   - Dropdown shows: Nairobi, Mombasa, Kisumu
   - System loads ~6-14 areas per city

2. **City Profile**
   - Select an area
   - View 5 key metrics:
     * Population count
     * Mobility Score (%)
     * Environment Quality (%)
     * Infrastructure Index (%)
     * Business Activity (%)

3. **Area Comparison**
   - Choose 2 areas in same city
   - Radar chart shows relative strengths
   - Color-coded for visual clarity

4. **Opportunity Engine**
   - Select industry (Food, Tech, Retail)
   - Click Analyze
   - Bar chart ranks areas by opportunity score

---

## 🐳 Deployment

### Option 1: Docker (Recommended)

1. **Create Docker Compose file** (`docker-compose.yml`)
   ```yaml
   version: '3.8'
   services:
     backend:
       build: ./backend
       ports:
         - "8000:8000"
       environment:
         - DATABASE_URL=postgresql://user:pass@db/citypulse
       depends_on:
         - db
     
     frontend:
       build: ./frontend
       ports:
         - "3000:3000"
       depends_on:
         - backend
     
     db:
       image: postgres:13
       environment:
         POSTGRES_DB: citypulse
         POSTGRES_USER: user
         POSTGRES_PASSWORD: pass
   ```

2. **Build and run**
   ```bash
   docker-compose up -d
   ```

### Option 2: Cloud Platforms

#### Heroku
```bash
heroku login
heroku create citypulse-app
git push heroku main
heroku open
```

#### Render
- Connect GitHub repo
- Backend: `python -m uvicorn backend.main:app --host 0.0.0.0`
- Frontend: `npm run build && npm start`

#### AWS EC2 + RDS
1. Launch Ubuntu EC2 instance
2. Install Python, Node, PostgreSQL client
3. Deploy backend to EC2, frontend to CloudFront
4. Connect to RDS PostgreSQL database

#### Vercel (Frontend) + Railway (Backend)
- Frontend on Vercel with `npm run build`
- Backend on Railway with `uvicorn backend.main:app`
- PostgreSQL on Railway

### Environment Variables

Create `.env` file in backend:
```
DATABASE_URL=postgresql://user:password@localhost/citypulse
ENVIRONMENT=production
CORS_ORIGINS=https://yourdomain.com
```

---

## 📂 Project Structure

```
citypulse/
├── backend/
│   ├── __init__.py
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
├── README.md               # This file
└── docker-compose.yml      # Container orchestration
```

---

## 🔌 API Endpoints

### Cities
```http
GET /cities
Response: [{"id": 1, "name": "Nairobi"}, ...]
```

### Areas by City
```http
GET /areas/{city_id}
Response: [{"id": 1, "name": "CBD"}, ...]
```

### Area Profile
```http
GET /area-profile/{area_id}
Response: {
  "id": 1,
  "name": "CBD",
  "indicators": {
    "population": 200000,
    "mobility_score": 0.7,
    "environment_score": 0.6,
    ...
  }
}
```

### Compare Areas
```http
GET /compare-areas?area1=1&area2=2
Response: {
  "area1": {...},
  "area2": {...}
}
```

### Opportunity Engine
```http
POST /opportunity-engine
Body: {"business_type": "Demo", "industry": "Tech"}
Response: {
  "ranked_opportunities": [
    {"area": "CBD", "opportunity_score": 0.85},
    ...
  ]
}
```

### Industries
```http
GET /industries
Response: ["Food", "Tech", "Retail"]
```

---

## 🎓 Data Engineering Highlights

### Skills Demonstrated

1. **ETL Pipeline** (`seed.py`)
   - Data extraction from structured arrays
   - Transformation into ORM objects
   - Loading into SQLite/PostgreSQL
   - ~78 records seeded atomically

2. **Database Design**
   - Hierarchical data modeling (City → Area)
   - Foreign key relationships
   - One-to-many relationships with SQLAlchemy
   - Efficient indexing on frequently queried columns

3. **API Development** (`main.py`)
   - RESTful endpoint design
   - Query optimization with SQLAlchemy filters
   - CORS middleware for cross-origin requests
   - Dependency injection for DB sessions

4. **Data Modeling**
   - Calculated fields (health_score, growth_index)
   - Normalized scoring (0-1 range)
   - Industry-based opportunity scoring
   - Real-world metric compilation

5. **Backend Architecture**
   - Separation of concerns (models, main, database)
   - Async request handling
   - Error handling and logging
   - Stateless, scalable design

6. **Frontend Integration**
   - Client-side filtering (city → areas)
   - Efficient state management
   - Chart rendering with normalized data
   - Responsive UI/UX

---

## 📈 Future Roadmap

### Phase 2: Advanced Analytics
- [ ] Time-series data (historical trends)
- [ ] Predictive modeling (growth forecasting)
- [ ] ML-powered recommendations
- [ ] LLM narrative summaries

### Phase 3: Data Infrastructure
- [ ] PostgreSQL + PostGIS (geospatial data)
- [ ] Apache Airflow (ETL orchestration)
- [ ] Real-time data ingestion
- [ ] Data warehouse (Snowflake/BigQuery)

### Phase 4: Scale & Performance
- [ ] Caching layer (Redis)
- [ ] API rate limiting
- [ ] Database query optimization
- [ ] Load testing (Locust)

### Phase 5: Enterprise Features
- [ ] User authentication & roles
- [ ] Custom dashboards
- [ ] API key management
- [ ] Data export (CSV, Excel, API)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License — see LICENSE file for details.

---

## 👤 Author

**Your Name** — Data Engineer & Full-Stack Developer

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [your-linkedin](https://linkedin.com/in/yourprofile)
- Portfolio: [yourportfolio.com](https://yourportfolio.com)

---

## 🙏 Acknowledgments

- FastAPI documentation and best practices
- Material-UI component library
- Recharts visualization library
- Kenya urban data (for project context)

---

## ❓ FAQ

**Q: Can I use this with PostgreSQL instead of SQLite?**  
A: Yes! Update `DATABASE_URL` in `backend/database.py` to your PostgreSQL connection string.

**Q: How do I add more cities?**  
A: Edit `backend/seed.py`, add cities and areas to the data dictionaries, then run `python -m backend.seed`.

**Q: Is this production-ready?**  
A: Yes, with these additions: PostgreSQL database, environment variable management, error logging, input validation.

**Q: How do I deploy to Heroku?**  
A: See Deployment section. Requires `Procfile`, environment vars, and PostgreSQL add-on.

**Q: What's the license?**  
A: MIT — free for personal and commercial use.

---

**Last Updated**: 2024  
**Status**: ✅ Production Ready | 🚀 Actively Maintained
