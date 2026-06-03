import React, { useState, useEffect, useRef } from "react";
import {
  Container, Card, CardContent, Typography, Button, Select, MenuItem,
  ThemeProvider, createTheme, CssBaseline, IconButton, CircularProgress,
  Snackbar, Alert
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Tooltip, BarChart, Bar, XAxis, YAxis
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function App() {
  const [mode, setMode] = useState("light");
  const [areas, setAreas] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [profileArea, setProfileArea] = useState(null);
  const [areaProfile, setAreaProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [area1, setArea1] = useState(null);
  const [area2, setArea2] = useState(null);
  const [compareData, setCompareData] = useState(null);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [industry, setIndustry] = useState("");
  const [opportunity, setOpportunity] = useState(null);
  const [loadingOpportunity, setLoadingOpportunity] = useState(false);
  const [error, setError] = useState(null);
  const dashboardRef = useRef();

  // Theme
  const getTheme = (mode) =>
    createTheme({
      palette: { mode },
    });

  // Fetch Areas
  useEffect(() => {
    fetch("http://localhost:8000/areas")
      .then((res) => res.json())
      .then(setAreas)
      .catch(() => setError("Failed to load areas"));
  }, []);

  // Fetch Industries
  useEffect(() => {
    fetch("http://localhost:8000/industries")
      .then((res) => res.json())
      .then(setIndustries)
      .catch(() => setError("Failed to load industries"));
  }, []);

  // Fetch Area Profile
  useEffect(() => {
    if (profileArea) {
      setLoadingProfile(true);
      fetch(`http://localhost:8000/area-profile/${profileArea}`)
        .then((res) => res.json())
        .then(setAreaProfile)
        .catch(() => setAreaProfile(null))
        .finally(() => setLoadingProfile(false));
    }
  }, [profileArea]);

  // Fetch Compare Areas
  useEffect(() => {
    if (area1 && area2) {
      setLoadingCompare(true);
      fetch(`http://localhost:8000/compare-areas?area1=${area1}&area2=${area2}`)
        .then((res) => res.json())
        .then(setCompareData)
        .catch(() => setCompareData(null))
        .finally(() => setLoadingCompare(false));
    }
  }, [area1, area2]);

  // Run Opportunity Engine
  const runEngine = () => {
    setLoadingOpportunity(true);
    fetch("http://localhost:8000/opportunity-engine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ business_type: "Demo", industry }),
    })
      .then((res) => res.json())
      .then(setOpportunity)
      .catch(() => setOpportunity(null))
      .finally(() => setLoadingOpportunity(false));
  };

  // Print dashboard
  const handlePrint = async () => {
    const element = dashboardRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("CityPulse-Dashboard.pdf");
  };

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <Container sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          CityPulse Dashboard
        </Typography>

        {/* Theme Toggle */}
        <IconButton
          onClick={() => setMode(mode === "dark" ? "light" : "dark")}
          sx={{ mb: 3 }}
          color="inherit"
        >
          {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        {/* Print Button */}
        <Button variant="contained" color="secondary" onClick={handlePrint} sx={{ mb: 3 }}>
          Print Dashboard
        </Button>

        {error && <Alert severity="error">{error}</Alert>}

        <div ref={dashboardRef}>
          {/* Area Profile */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">Area Profile</Typography>
              <Select
                value={profileArea || ""}
                onChange={(e) => setProfileArea(e.target.value)}
                sx={{ mb: 2 }}
              >
                {areas.map((a) => (
                  <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                ))}
              </Select>
              {areaProfile ? (
                <>
                  <Typography>ID: {areaProfile.id}</Typography>
                  <Typography>Name: {areaProfile.name}</Typography>
                </>
              ) : loadingProfile ? (
                <CircularProgress />
              ) : (
                <Typography color="textSecondary">Select an area to analyze.</Typography>
              )}
            </CardContent>
          </Card>

          {/* Compare Areas */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">Compare Areas</Typography>
              <Select value={area1 || ""} onChange={(e) => setArea1(e.target.value)} sx={{ mr: 2 }}>
                {areas.map((a) => (
                  <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                ))}
              </Select>
              <Select value={area2 || ""} onChange={(e) => setArea2(e.target.value)} sx={{ mr: 2 }}>
                {areas.map((a) => (
                  <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                ))}
              </Select>

              {compareData ? (
                <RadarChart
                  outerRadius={90}
                  width={500}
                  height={300}
                  data={[
                    {
                      indicator: "Population",
                      A: compareData.area1.indicators.population / 200000,
                      B: compareData.area2.indicators.population / 200000,
                    },
                    {
                      indicator: "Mobility",
                      A: compareData.area1.indicators.mobility_score,
                      B: compareData.area2.indicators.mobility_score,
                    },
                    {
                      indicator: "Environment",
                      A: compareData.area1.indicators.environment_score,
                      B: compareData.area2.indicators.environment_score,
                    },
                    {
                      indicator: "Infrastructure",
                      A: compareData.area1.indicators.infrastructure_score,
                      B: compareData.area2.indicators.infrastructure_score,
                    },
                    {
                      indicator: "Business",
                      A: compareData.area1.indicators.business_activity_score,
                      B: compareData.area2.indicators.business_activity_score,
                    },
                  ]}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="indicator" />
                  <PolarRadiusAxis angle={30} domain={[0, 1]} />
                  <Radar
                    name={compareData.area1.name}
                    dataKey="A"
                    stroke={mode === "dark" ? "#00e5ff" : "#00695c"}
                    fill={mode === "dark" ? "#00e5ff" : "#00695c"}
                    fillOpacity={0.6}
                  />
                  <Radar
                    name={compareData.area2.name}
                    dataKey="B"
                    stroke={mode === "dark" ? "#ff4081" : "#ff8f00"}
                    fill={mode === "dark" ? "#ff4081" : "#ff8f00"}
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              ) : loadingCompare ? (
                <CircularProgress />
              ) : (
                <Typography color="textSecondary">Choose two areas to compare.</Typography>
              )}
            </CardContent>
          </Card>

          {/* Opportunity Engine */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">Opportunity Engine</Typography>
              <Select
                value={industry || ""}
                onChange={(e) => setIndustry(e.target.value)}
                sx={{ mr: 2 }}
              >
                {industries.map((ind, idx) => (
                  <MenuItem key={idx} value={ind}>{ind}</MenuItem>
                ))}
              </Select>
              <Button variant="contained" onClick={runEngine}>
                Run
              </Button>
                {opportunity ? (
                <BarChart
                  width={500}
                  height={300}
                  data={opportunity.ranked_opportunities}
                >
                  <XAxis
                    dataKey="area"
                    stroke={mode === "dark" ? "#ffffff" : "#000000"}
                  />
                  <YAxis stroke={mode === "dark" ? "#ffffff" : "#000000"} />
                  <Tooltip />
                  <Bar
                    dataKey="opportunity_score"
                    fill={mode === "dark" ? "#00e5ff" : "#00695c"}
                  />
                </BarChart>
              ) : loadingOpportunity ? (
                <CircularProgress />
              ) : (
                <Typography color="textSecondary">
                  Select an industry and run analysis.
                </Typography>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={4000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            Oops! Something went wrong: {error}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default App;
