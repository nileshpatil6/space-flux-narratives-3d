
import { useState, useEffect } from 'react';

// Types for the climate data
export type ClimateDataPoint = {
  year: number;
  co2: number;
  methane: number;
  temperature: number;
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
};

export type ClimateData = {
  global: ClimateDataPoint[];
  regions: {
    [key: string]: ClimateDataPoint[];
  };
  current: {
    co2: number;
    methane: number;
    temperature: number;
  };
};

// Mock data - replace with actual API calls
const MOCK_CLIMATE_DATA: ClimateData = {
  global: [
    { year: 1950, co2: 310, methane: 1120, temperature: 0 },
    { year: 1960, co2: 315, methane: 1190, temperature: 0.03 },
    { year: 1970, co2: 325, methane: 1270, temperature: 0.05 },
    { year: 1980, co2: 340, methane: 1400, temperature: 0.15 },
    { year: 1990, co2: 355, methane: 1520, temperature: 0.32 },
    { year: 2000, co2: 370, methane: 1630, temperature: 0.45 },
    { year: 2010, co2: 390, methane: 1780, temperature: 0.62 },
    { year: 2020, co2: 415, methane: 1880, temperature: 0.85 }
  ],
  regions: {
    'North America': [
      { year: 1950, co2: 315, methane: 1150, temperature: 0.02 },
      { year: 1980, co2: 345, methane: 1450, temperature: 0.18 },
      { year: 2010, co2: 395, methane: 1800, temperature: 0.65 },
      { year: 2020, co2: 420, methane: 1900, temperature: 0.89 }
    ],
    'Europe': [
      { year: 1950, co2: 312, methane: 1130, temperature: 0.01 },
      { year: 1980, co2: 342, methane: 1420, temperature: 0.16 },
      { year: 2010, co2: 392, methane: 1790, temperature: 0.63 },
      { year: 2020, co2: 418, methane: 1890, temperature: 0.87 }
    ],
    'Asia': [
      { year: 1950, co2: 308, methane: 1100, temperature: -0.01 },
      { year: 1980, co2: 338, methane: 1380, temperature: 0.14 },
      { year: 2010, co2: 398, methane: 1820, temperature: 0.68 },
      { year: 2020, co2: 425, methane: 1910, temperature: 0.92 }
    ]
  },
  current: {
    co2: 418,
    methane: 1900,
    temperature: 0.9
  }
};

// Hook for fetching climate data
export const useGlobeData = (region: string = 'global') => {
  const [data, setData] = useState<ClimateData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an actual API call:
        // const response = await fetch('https://api.ghgcenter.org/v1/climate-data');
        // const data = await response.json();

        // For now, we'll use our mock data with a small delay to simulate a network request
        setTimeout(() => {
          setData(MOCK_CLIMATE_DATA);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching climate data:', err);
        setError('Failed to load climate data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to get data for a specific region
  const getRegionData = (regionName: string) => {
    if (!data) return null;
    
    if (regionName === 'global') {
      return data.global;
    }
    
    return data.regions[regionName] || null;
  };

  return {
    data,
    loading,
    error,
    getRegionData,
    currentData: data?.current
  };
};
