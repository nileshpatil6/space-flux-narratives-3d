
const USER_AGENT = "climate-checker/1.0";

interface GeocodingResult {
  latitude: number;
  longitude: number;
}

interface CurrentWeather {
  time: string;
  temperature_c: number;
  windspeed_kmph: number;
  relative_humidity_percent: number | null;
}

interface GlobalCO2 {
  year: number;
  month: number;
  co2_ppm: number;
}

interface NasaPowerData {
  date: string;
  temperature_c: number;
  precipitation_mm: number;
}

interface YearlyStats {
  avg_temperature_c: number | null;
  total_precipitation_mm: number;
}

interface AirQuality {
  timestamp: string;
  pm2_5: number;
  pm10: number;
  carbon_monoxide: number;
  nitrogen_dioxide: number;
  sulphur_dioxide: number;
  ozone: number;
  aerosol_optical_depth: number;
}

export interface ClimateData {
  coordinates: GeocodingResult;
  currentWeather: CurrentWeather;
  nasaPowerLatest: NasaPowerData;
  globalCO2: GlobalCO2;
  nasaPowerHistory: Record<string, YearlyStats>;
  airQuality: AirQuality;
  temperatureHistory: Record<string, {
    avg_max_temp: number | null;
    avg_min_temp: number | null;
  }>;
}

export const geocodeCity = async (city: string): Promise<GeocodingResult> => {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
  );
  if (!res.ok) throw new Error("Failed to geocode city");
  const data = await res.json();
  if (!data.results?.length) throw new Error(`City '${city}' not found.`);
  
  return {
    latitude: data.results[0].latitude,
    longitude: data.results[0].longitude,
  };
};

export const getCurrentWeather = async (lat: number, lon: number): Promise<CurrentWeather> => {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m&timezone=auto`
  );
  if (!res.ok) throw new Error("Failed to fetch current weather");
  const data = await res.json();
  
  return {
    time: data.current_weather.time,
    temperature_c: data.current_weather.temperature,
    windspeed_kmph: data.current_weather.windspeed,
    relative_humidity_percent: data.hourly.relativehumidity_2m[
      data.hourly.time.indexOf(data.current_weather.time)
    ],
  };
};

export const getClimateData = async (city: string): Promise<ClimateData> => {
  const coordinates = await geocodeCity(city);
  const currentWeather = await getCurrentWeather(coordinates.latitude, coordinates.longitude);
  
  // For demo purposes, returning partial data
  // In a real app, you would implement all the API calls
  return {
    coordinates,
    currentWeather,
    nasaPowerLatest: {
      date: new Date().toISOString(),
      temperature_c: currentWeather.temperature_c,
      precipitation_mm: 0,
    },
    globalCO2: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      co2_ppm: 420, // Example value
    },
    nasaPowerHistory: {},
    airQuality: {
      timestamp: new Date().toISOString(),
      pm2_5: 10,
      pm10: 20,
      carbon_monoxide: 0.5,
      nitrogen_dioxide: 20,
      sulphur_dioxide: 5,
      ozone: 40,
      aerosol_optical_depth: 0.1,
    },
    temperatureHistory: {},
  };
};
