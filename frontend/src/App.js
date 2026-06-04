import React, { useState, useEffect, useRef } from "react";
import {
  Container, Card, CardContent, Typography, Button, Select, MenuItem,
  ThemeProvider, createTheme, CssBaseline, IconButton, CircularProgress,
  Snackbar, Alert, Box, Divider
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Tooltip, BarChart, Bar, XAxis, YAxis
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// API URL - uses environment variable or defaults to localhost
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

function App() {
  const [mode, setMode] = useState("light");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
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

  const getTheme = (mode) =>
    createTheme({
      palette: {
        mode,
        primary: {
          main: mode === "dark" ? "#00d4ff" : "#00796b",
        },
        secondary: {
          main: mode === "dark" ? "#ff6b9d" : "#ff8f00",
        },
        background: {
          default: mode === "dark" ? "#0a0e27" : "#f5f7fa",
          paper: mode === "dark" ? "#151b3a" : "#ffffff",
        },
      },
      typography: {
        fontFamily: '"Inter", "Roboto", sans-serif',
        h4: {
          fontWeight: 700,
          letterSpacing: "-0.5px",
        },
        h6: {
          fontWeight: 600,
        },
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: "12px",
              boxShadow: mode === "dark"
                ? "0 4px 20px rgba(0, 0, 0, 0.4)"
                : "0 2px 8px rgba(0, 0, 0, 0.1)",
              transition: "box-shadow 0.3s ease",
              "&:hover": {
                boxShadow: mode === "dark"
                  ? "0 8px 30px rgba(0, 212, 255, 0.15)"
                  : "0 4px 16px rgba(0, 121, 107, 0.12)",
              },
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            contained: {
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              transition: "all 0.3s ease",
            },
          },
        },
      },
    });

  useEffect(() => {
    fetch(`${API_URL}/cities`)
      .then((res) => res.json())
      .then(setCities)
      .catch(() => setError("Failed to load cities"));
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetch(`${API_URL}/areas/${selectedCity}`)
        .then((res) => res.json())
        .then(setAreas)
        .catch(() => {
          setAreas([]);
          setError("Failed to load areas");
        });
      setProfileArea(null);
      setArea1(null);
      setArea2(null);
    }
  }, [selectedCity]);

  useEffect(() => {
    fetch(`${API_URL}/industries`)
      .then((res) => res.json())
      .then(setIndustries)
      .catch(() => setError("Failed to load industries"));
  }, []);

  useEffect(() => {
    if (profileArea) {
      setLoadingProfile(true);
      fetch(`${API_URL}/area-profile/${profileArea}`)
        .then((res) => res.json())
        .then(setAreaProfile)
        .catch(() => setAreaProfile(null))
        .finally(() => setLoadingProfile(false));
    }
  }, [profileArea]);

  useEffect(() => {
    if (area1 && area2) {
      setLoadingCompare(true);
      fetch(
        `${API_URL}/compare-areas?area1=${area1}&area2=${area2}`
      )
        .then((res) => res.json())
        .then(setCompareData)
        .catch(() => setCompareData(null))
        .finally(() => setLoadingCompare(false));
    }
  }, [area1, area2]);

  const runEngine = () => {
    setLoadingOpportunity(true);
    fetch(`${API_URL}/opportunity-engine`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ business_type: "Demo", industry }),
    })
      .then((res) => res.json())
      .then(setOpportunity)
      .catch(() => setOpportunity(null))
      .finally(() => setLoadingOpportunity(false));
  };

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
      <Container maxWidth="lg" sx={{ py: 4, minHeight: "100vh",
                                     display: "flex",
                                     flexDirection: "column" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between",
                   alignItems: "center", mb: 4 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{
              background: mode === "dark"
                ? "linear-gradient(135deg, #00d4ff, #00bcd4)"
                : "linear-gradient(135deg, #00796b, #00897b)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              CityPulse Urban Intelligence
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Data-driven analytics for metropolitan areas
            </Typography>
          </Box>
          <IconButton
            onClick={() => setMode(mode === "dark" ? "light" : "dark")}
            color="primary"
            sx={{
              backgroundColor: mode === "dark"
                ? "rgba(0, 212, 255, 0.1)"
                : "rgba(0, 121, 107, 0.1)",
              "&:hover": {
                backgroundColor: mode === "dark"
                  ? "rgba(0, 212, 255, 0.2)"
                  : "rgba(0, 121, 107, 0.2)",
              },
            }}
          >
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>

        <Button
          variant="contained"
          color="secondary"
          onClick={handlePrint}
          sx={{ mb: 3 }}
        >
          Export to PDF
        </Button>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ flex: 1 }}>
          <div ref={dashboardRef}>
            {!selectedCity && (
              <Card sx={{ mb: 4, textAlign: "center", py: 3 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom sx={{
                    fontWeight: 600,
                  }}>
                    Welcome to CityPulse
                  </Typography>
                  <Typography variant="body1" color="textSecondary"
                              sx={{ mb: 2 }}>
                    Select a city below to start your urban analysis. Explore
                    metropolitan indicators, compare neighborhoods, and discover
                    business opportunities across Kenya's major cities.
                  </Typography>
                </CardContent>
              </Card>
            )}

            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  📍 Select City
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{
                  mb: 2,
                }}>
                  Choose a city to view areas and analyze urban metrics.
                </Typography>
                <Select
                  value={selectedCity || ""}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  sx={{ minWidth: 250 }}
                >
                  <MenuItem value="">-- Select a City --</MenuItem>
                  {cities.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
              </CardContent>
            </Card>

            {selectedCity && (
              <>
                <Card sx={{ mb: 4 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      🏙️ City Profile
                    </Typography>
                    <Typography variant="body2" color="textSecondary"
                                sx={{ mb: 2 }}>
                      Select an area within{" "}
                      {cities.find((c) => c.id === parseInt(selectedCity))
                        ?.name || "this city"}{" "}
                      to view detailed indicators including population,
                      mobility, environment, infrastructure, and business
                      activity metrics.
                    </Typography>
                    <Select
                      value={profileArea || ""}
                      onChange={(e) => setProfileArea(e.target.value)}
                      sx={{ mb: 2, minWidth: 250 }}
                      disabled={!selectedCity}
                    >
                      <MenuItem value="">-- Select an Area --</MenuItem>
                      {areas.map((a) => (
                        <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                      ))}
                    </Select>

                    {areaProfile ? (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: "grid",
                                   gridTemplateColumns: "repeat(auto-fit,"
                                     + " minmax(200px, 1fr))",
                                   gap: 2 }}>
                          <Box>
                            <Typography variant="caption"
                                        color="textSecondary">
                              Area
                            </Typography>
                            <Typography variant="h6">
                              {areaProfile.name}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption"
                                        color="textSecondary">
                              Population
                            </Typography>
                            <Typography variant="h6">
                              {areaProfile.indicators.population
                                ? areaProfile.indicators.population
                                  .toLocaleString()
                                : "N/A"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption"
                                        color="textSecondary">
                              Mobility Score
                            </Typography>
                            <Typography variant="h6">
                              {areaProfile.indicators.mobility_score
                                ? (
                                  areaProfile.indicators
                                    .mobility_score * 100
                                ).toFixed(0) + "%"
                                : "N/A"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption"
                                        color="textSecondary">
                              Environment Score
                            </Typography>
                            <Typography variant="h6">
                              {areaProfile.indicators
                                .environment_score
                                ? (
                                  areaProfile.indicators
                                    .environment_score * 100
                                ).toFixed(0) + "%"
                                : "N/A"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption"
                                        color="textSecondary">
                              Infrastructure Score
                            </Typography>
                            <Typography variant="h6">
                              {areaProfile.indicators
                                .infrastructure_score
                                ? (
                                  areaProfile.indicators
                                    .infrastructure_score * 100
                                ).toFixed(0) + "%"
                                : "N/A"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption"
                                        color="textSecondary">
                              Business Activity Score
                            </Typography>
                            <Typography variant="h6">
                              {areaProfile.indicators
                                .business_activity_score
                                ? (
                                  areaProfile.indicators
                                    .business_activity_score * 100
                                ).toFixed(0) + "%"
                                : "N/A"}
                            </Typography>
                          </Box>
                        </Box>
                      </>
                    ) : loadingProfile ? (
                      <Box sx={{ display: "flex", justifyContent: "center",
                                 py: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Typography color="textSecondary">
                        Select an area to view its profile metrics.
                      </Typography>
                    )}
                  </CardContent>
                </Card>

                <Card sx={{ mb: 4 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      📊 Compare Areas
                    </Typography>
                    <Typography variant="body2" color="textSecondary"
                                sx={{ mb: 2 }}>
                      Select two areas to compare their urban indicators side by
                      side using an interactive radar chart.
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, mb: 2,
                               flexWrap: "wrap" }}>
                      <Select
                        value={area1 || ""}
                        onChange={(e) => setArea1(e.target.value)}
                        disabled={!selectedCity}
                        sx={{ minWidth: 200 }}
                      >
                        <MenuItem value="">-- Area 1 --</MenuItem>
                        {areas.map((a) => (
                          <MenuItem key={a.id} value={a.id}>{a.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <Select
                        value={area2 || ""}
                        onChange={(e) => setArea2(e.target.value)}
                        disabled={!selectedCity}
                        sx={{ minWidth: 200 }}
                      >
                        <MenuItem value="">-- Area 2 --</MenuItem>
                        {areas.map((a) => (
                          <MenuItem key={a.id} value={a.id}>{a.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>

                    {compareData ? (
                      <Box sx={{ overflowX: "auto" }}>
                        <RadarChart
                          outerRadius={90}
                          width={500}
                          height={300}
                          data={[
                            {
                              indicator: "Population",
                              A: compareData.area1.indicators
                                .population / 200000,
                              B: compareData.area2.indicators
                                .population / 200000,
                            },
                            {
                              indicator: "Mobility",
                              A: compareData.area1.indicators
                                .mobility_score,
                              B: compareData.area2.indicators
                                .mobility_score,
                            },
                            {
                              indicator: "Environment",
                              A: compareData.area1.indicators
                                .environment_score,
                              B: compareData.area2.indicators
                                .environment_score,
                            },
                            {
                              indicator: "Infrastructure",
                              A: compareData.area1.indicators
                                .infrastructure_score,
                              B: compareData.area2.indicators
                                .infrastructure_score,
                            },
                            {
                              indicator: "Business",
                              A: compareData.area1.indicators
                                .business_activity_score,
                              B: compareData.area2.indicators
                                .business_activity_score,
                            },
                          ]}
                        >
                          <PolarGrid />
                          <PolarAngleAxis dataKey="indicator" />
                          <PolarRadiusAxis angle={30}
                                           domain={[0, 1]} />
                          <Radar
                            name={compareData.area1.name}
                            dataKey="A"
                            stroke={mode === "dark"
                              ? "#00d4ff"
                              : "#00796b"}
                            fill={mode === "dark"
                              ? "#00d4ff"
                              : "#00796b"}
                            fillOpacity={0.6}
                          />
                          <Radar
                            name={compareData.area2.name}
                            dataKey="B"
                            stroke={mode === "dark"
                              ? "#ff6b9d"
                              : "#ff8f00"}
                            fill={mode === "dark"
                              ? "#ff6b9d"
                              : "#ff8f00"}
                            fillOpacity={0.6}
                          />
                          <Tooltip />
                        </RadarChart>
                      </Box>
                    ) : loadingCompare ? (
                      <Box sx={{ display: "flex", justifyContent: "center",
                                 py: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Typography color="textSecondary">
                        Select two areas to compare their metrics.
                      </Typography>
                    )}
                  </CardContent>
                </Card>

                <Card sx={{ mb: 4 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      💼 Opportunity Engine
                    </Typography>
                    <Typography variant="body2" color="textSecondary"
                                sx={{ mb: 2 }}>
                      Analyze business opportunities by industry. See which
                      areas within your selected city have the highest
                      potential for specific sectors.
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, mb: 2,
                               flexWrap: "wrap",
                               alignItems: "center" }}>
                      <Select
                        value={industry || ""}
                        onChange={(e) => setIndustry(e.target.value)}
                        sx={{ minWidth: 200 }}
                      >
                        <MenuItem value="">-- Select Industry --</MenuItem>
                        {industries.map((ind, idx) => (
                          <MenuItem key={idx} value={ind}>{ind}</MenuItem>
                        ))}
                      </Select>
                      <Button
                        variant="contained"
                        onClick={runEngine}
                        disabled={!industry}
                      >
                        Analyze
                      </Button>
                    </Box>

                    {opportunity ? (
                      <Box sx={{ overflowX: "auto" }}>
                        <BarChart
                          width={500}
                          height={300}
                          data={opportunity.ranked_opportunities}
                        >
                          <XAxis
                            dataKey="area"
                            stroke={mode === "dark"
                              ? "#ffffff"
                              : "#000000"}
                          />
                          <YAxis
                            stroke={mode === "dark"
                              ? "#ffffff"
                              : "#000000"}
                          />
                          <Tooltip />
                          <Bar
                            dataKey="opportunity_score"
                            fill={mode === "dark"
                              ? "#00d4ff"
                              : "#00796b"}
                          />
                        </BarChart>
                      </Box>
                    ) : loadingOpportunity ? (
                      <Box sx={{ display: "flex", justifyContent: "center",
                                 py: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Typography color="textSecondary">
                        Select an industry and click Analyze to see opportunity
                        rankings.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </Box>

        <Box sx={{
          mt: 8,
          pt: 4,
          borderTop: mode === "dark"
            ? "1px solid rgba(0, 212, 255, 0.1)"
            : "1px solid rgba(0, 121, 107, 0.1)",
          textAlign: "center",
        }}>
          <Typography variant="body2" color="textSecondary" sx={{
            mb: 1,
          }}>
            Built with{" "}
            <Box component="span" sx={{
              color: mode === "dark" ? "#ff6b9d" : "#ff8f00",
              fontSize: "1.1em",
            }}>
              ♥
            </Box>
            {" "}by{" "}
            <Box
              component="a"
              href="https://github.com/frankTheCodeBoy"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: mode === "dark" ? "#00d4ff" : "#00796b",
                textDecoration: "none",
                fontWeight: 600,
                transition: "all 0.3s ease",
                "&:hover": {
                  textDecoration: "underline",
                  opacity: 0.8,
                },
              }}
            >
              Francis Olum
            </Box>
            {" "}
            (frankTheCodeBoy)
          </Typography>
          <Typography variant="caption" color="textSecondary">
            CityPulse © 2024-2026 — Urban Intelligence Analytics
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{
            display: "block",
            mt: 1,
          }}>
            Data Engineering | Full-Stack Development | Cloud Deployment
          </Typography>
        </Box>

        <Snackbar
          open={!!error}
          autoHideDuration={4000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default App;
