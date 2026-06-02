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

// Define light and dark themes
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
  const [mode, setMode] = useState("dark"); // default

  // Load saved theme from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  // Save theme when it changes
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  // Fetch Area Profile
  useEffect(() => {
    fetch("http://127.0.0.1:8000/area-profile/1")
      .then((res) => res.json())
      .then(setAreaProfile);
  }, []);

  // Fetch Compare Areas
  useEffect(() => {
    fetch("http://127.0.0.1:8000/compare-areas?area1=1&area2=2")
      .then((res) => res.json())
      .then(setCompareData);
  }, []);

  // Run Opportunity Engine
  const runEngine = () => {
    fetch("http://127.0.0.1:8000/opportunity-engine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ business_type: "Demo", industry }),
    })
      .then((res) => res.json())
      .then(setOpportunity);
  };

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <Container sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          CityPulse Dashboard
        </Typography>

        {/* Theme Toggle with Icon */}
        <IconButton
          onClick={() => setMode(mode === "dark" ? "light" : "dark")}
          sx={{ mb: 3 }}
          color="inherit"
        >
          {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        {/* Area Profile */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Area Profile</Typography>
            {areaProfile ? (
              <>
                <Typography>ID: {areaProfile.id}</Typography>
                <Typography>Name: {areaProfile.name}</Typography>
              </>
            ) : (
              <Typography>Loading...</Typography>
            )}
          </CardContent>
        </Card>

        {/* Compare Areas */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Compare Areas</Typography>
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
                  stroke={mode === "dark" ? "#00e5ff" : "#1976d2"}
                  fill={mode === "dark" ? "#00e5ff" : "#1976d2"}
                  fillOpacity={0.6}
                />
                <Radar
                  name={compareData.area2.name}
                  dataKey="B"
                  stroke={mode === "dark" ? "#ff4081" : "#d32f2f"}
                  fill={mode === "dark" ? "#ff4081" : "#d32f2f"}
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            ) : (
              <Typography>Loading...</Typography>
            )}
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
            {opportunity && (
              <BarChart
                width={500}
                height={300}
                data={opportunity.ranked_opportunities}
              >
                <XAxis
                  dataKey="area"
                  stroke={mode === "dark" ? "#ffffff" : "#000000"}
                />
                <YAxis
                  stroke={mode === "dark" ? "#ffffff" : "#000000"}
                />
                <Tooltip />
                <Bar
                  dataKey="opportunity_score"
                  fill={mode === "dark" ? "#00e5ff" : "#1976d2"}
                />
              </BarChart>
            )}
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default App;
