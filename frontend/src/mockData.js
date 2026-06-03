// src/mockData.js

export const mockAreaProfile = {
  id: 1,
  name: "CBD",
};

export const mockCompareData = {
  area1: {
    name: "CBD",
    indicators: {
      population: 120000,
      mobility_score: 0.8,
      environment_score: 0.6,
      infrastructure_score: 0.7,
      business_activity_score: 0.9,
    },
  },
  area2: {
    name: "Westlands",
    indicators: {
      population: 90000,
      mobility_score: 0.7,
      environment_score: 0.5,
      infrastructure_score: 0.8,
      business_activity_score: 0.85,
    },
  },
};

export const mockOpportunity = {
  ranked_opportunities: [
    { area: "CBD", opportunity_score: 0.85 },
    { area: "Westlands", opportunity_score: 0.78 },
    { area: "Industrial Area", opportunity_score: 0.65 },
  ],
};
