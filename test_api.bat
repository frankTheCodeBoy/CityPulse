@echo off
echo Testing CityPulse API...

echo.
echo --- Area Profile (CBD) ---
curl http://127.0.0.1:8000/area-profile/1
echo.

echo --- Urban Health Score (CBD) ---
curl http://127.0.0.1:8000/urban-health-score/1
echo.

echo --- Compare Areas (CBD vs Westlands) ---
curl "http://127.0.0.1:8000/compare-areas?area1=1&area2=2"
echo.

echo --- Opportunity Engine: Food Industry ---
curl -X POST "http://127.0.0.1:8000/opportunity-engine" ^
     -H "Content-Type: application/json" ^
     -d "{\"business_type\":\"Restaurant\",\"industry\":\"Food\"}"
echo.

echo --- Opportunity Engine: Tech Industry ---
curl -X POST "http://127.0.0.1:8000/opportunity-engine" ^
     -H "Content-Type: application/json" ^
     -d "{\"business_type\":\"Startup Hub\",\"industry\":\"Tech\"}"
echo.

echo --- Opportunity Engine: Retail Industry ---
curl -X POST "http://127.0.0.1:8000/opportunity-engine" ^
     -H "Content-Type: application/json" ^
     -d "{\"business_type\":\"Clothing Store\",\"industry\":\"Retail\"}"
echo.

pause
