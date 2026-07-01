import pytest
from fastapi.testclient import TestClient

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from backend.main import app

client = TestClient(app)


def test_area_profile():
    response = client.get("/area-profile/1")
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "name" in data


def test_urban_health_score_no_indicators():
    response = client.get("/urban-health-score/999")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["message"].startswith("Select an area")


def test_compare_areas():
    response = client.get("/compare-areas?area1=1&area2=2")
    assert response.status_code == 200
    data = response.json()
    assert "area1" in data
    assert "area2" in data


def test_opportunity_engine_food():
    payload = {
        "business_type": "Restaurant",
        "industry": "Food",
        "city_id": 1,
    }
    response = client.post("/opportunity-engine", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["industry"].lower() == "food"
    assert "ranked_opportunities" in data


def test_opportunity_engine_tech():
    payload = {
        "business_type": "Startup Hub",
        "industry": "Tech",
        "city_id": 1,
    }
    response = client.post("/opportunity-engine", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["industry"].lower() == "tech"
    assert "ranked_opportunities" in data


def test_opportunity_engine_retail():
    payload = {
        "business_type": "Clothing Store",
        "industry": "Retail",
        "city_id": 1,
    }
    response = client.post("/opportunity-engine", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["industry"].lower() == "retail"
    assert "ranked_opportunities" in data
