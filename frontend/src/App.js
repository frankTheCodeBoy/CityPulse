import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

// Import mock data
import { mockAreaProfile, mockCompareData, mockOpportunity } from "./mockData";

// Theme generator
const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "dark"
        ? {
            primary: { main: "#00e5ff" },
            secondary: { main: "#ff4081" },
            background: { default: "#121212", paper: "#1e1e1e" },
            text: { primary: "#ffffff", secondary: "#b0bec5" },
          }
        : {
            primary: { main: "#1976d2" },
            secondary: { main: "#d32f2f" },
            background: { default: "#fafafa", paper: "#ffffff" },
            text: { primary: "#000000", secondary: "#555555" },
          }),
    },
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
      h4: { fontWeight: 700, letterSpacing: 1.2 },
      h6: { fontWeight: 600 },
    },
  });

function App() {
  const [areaProfile, setAreaProfile] = useState(null);
  const [compareData, setCompareData] = useState(null);
  const [industry, setIndustry] = useState("Food");
  const [opportunity, setOpportunity] = useState(null);
  const [mode, setMode] = useState("dark");
  const [area1, setArea1] = useState(1);
  const [area2, setArea2] = useState(2);
  const [error, setError] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingCompare, setLoadingCompare] = useState(true);
  const [loadingOpportunity, setLoadingOpportunity] = useState(false);

  // Load saved theme
  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) setMode(savedMode);
  }, []);
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  // Fetch Area Profile
  useEffect(() => {
    setLoadingProfile(true);
    fetch("http://127.0.0.1:8000/area-profile/1")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load Area Profile");
        return res.json();
      })
      .then(setAreaProfile)
      .catch((err) => {
        setError(err.message);
        setAreaProfile(mockAreaProfile); // fallback
      })
      .finally(() => setLoadingProfile(false));
  }, []);

  // Fetch Compare Areas dynamically
  useEffect(() => {
    if (area1 && area2) {
      setLoadingCompare(true);
      fetch(`http://127.0.0.1:8000/compare-areas?area1=${area1}&area2=${area2}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load Compare Areas");
          return res.json();
        })
        .then(setCompareData)
        .catch((err) => {
          setError(err.message);
          setCompareData(mockCompareData); // fallback
        })
        .finally(() => setLoadingCompare(false));
    }
  }, [area1, area2]);

  // Run Opportunity Engine
  const runEngine = () => {
    setLoadingOpportunity(true);
    fetch("http://127.0.0.1:8000/opportunity-engine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ business_type: "Demo", industry }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to run Opportunity Engine");
        return res.json();
      })
      .then(setOpportunity)
      .catch((err) => {
        setError(err.message);
        setOpportunity(mockOpportunity); // fallback
      })
      .finally(() => setLoadingOpportunity(false));
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

        {/* Error Display */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Area Profile */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Area Profile</Typography>
            {areaProfile ? (
              <>
                <Typography>ID: {areaProfile.id}</Typography>
                <Typography>Name: {areaProfile.name}</Typography>
              </>
            ) : loadingProfile ? (
              <CircularProgress />
            ) : null}
          </CardContent>
        </Card>

        {/* Compare Areas */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Compare Areas</Typography>
            <Select value={area1} onChange={(e) => setArea1(e.target.value)} sx={{ mr: 2 }}>
              <MenuItem value={1}>CBD</MenuItem>
              <MenuItem value={2}>Westlands</MenuItem>
              <MenuItem value={3}>Industrial Area</MenuItem>
            </Select>
            <Select value={area2} onChange={(e) => setArea2(e.target.value)} sx={{ mr: 2 }}>
              <MenuItem value={1}>CBD</MenuItem>
              <MenuItem value={2}>Westlands</MenuItem>
              <MenuItem value={3}>Industrial Area</MenuItem>
            </Select>

            {compareData ? (
              <RadarChart outerRadius={90} width={500} height={300} data={[
                { indicator: "Population", A: compareData.area1.indicators.population / 200000, B: compareData.area2.indicators.population / 200000 },
                { indicator: "Mobility", A: compareData.area1.indicators.mobility_score, B: compareData.area2.indicators.mobility_score },
                { indicator: "Environment", A: compareData.area1.indicators.environment_score, B: compareData.area2.indicators.environment_score },
                { indicator: "Infrastructure", A: compareData.area1.indicators.infrastructure_score, B: compareData.area2.indicators.infrastructure_score },
                { indicator: "Business", A: compareData.area1.indicators.business_activity_score, B: compareData.area2.indicators.business_activity_score },
              ]}>
                <PolarGrid />
                <PolarAngleAxis dataKey="indicator" />
                <PolarRadiusAxis angle={30} domain={[0, 1]} />
                <Radar name={compareData.area1.name} dataKey="A" stroke={mode === "dark" ? "#00e5ff" : "#1976d2"} fill={mode === "dark" ? "#00e5ff" : "#1976d2"} fillOpacity={0.6} />
                <Radar name={compareData.area2.name} dataKey="B" stroke={mode === "dark" ? "#ff4081" : "#d32f2f"} fill={mode === "dark" ? "#ff4081" : "#d32f2f"} fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            ) : loadingCompare ? (
              <CircularProgress />
            ) : null}
          </CardContent>
        </Card>
       {/* Opportunity Engine */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Opportunity Engine</Typography>
            <Select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              sx={{ mr: 2 }}
            >
              <MenuItem value="Food">Food</MenuItem>
              <MenuItem value="Tech">Tech</MenuItem>
              <MenuItem value="Retail">Retail</MenuItem>
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
                  fill={mode === "dark" ? "#00e5ff" : "#1976d2"}
                />
              </BarChart>
            ) : loadingOpportunity ? (
              <CircularProgress />
            ) : null}
          </CardContent>
        </Card>

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={4000}
          onClose={() => setError(null)}
          message={`Oops! Something went wrong: ${error}`}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // ✅ position
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
