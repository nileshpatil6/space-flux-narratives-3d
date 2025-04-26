
import { toast } from "@/components/ui/sonner";

// Types for our climate data responses
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  time: string;
  temperature_c: number;
  windspeed_kmph: number;
  relative_humidity_percent: number | null;
}

export interface GlobalCO2 {
  year: number;
  month: number;
  co2_ppm: number;
}

export interface NasaPowerData {
  date: string;
  temperature_c: number;
  precipitation_mm: number;
}

export interface AirQuality {
  timestamp: string;
  pm2_5: number;
  pm10: number;
  carbon_monoxide: number;
  nitrogen_dioxide: number;
  sulphur_dioxide: number;
  ozone: number;
  aerosol_optical_depth: number;
}

export interface AnnualClimateData {
  avg_temperature_c: number | null;
  total_precipitation_mm: number;
}

export interface AnnualTemperatureData {
  avg_max_temp: number | null;
  avg_min_temp: number | null;
}

export interface ClimateData {
  location: string;
  coordinates: Coordinates;
  currentWeather: CurrentWeather;
  nasaPowerLatest: NasaPowerData;
  globalCO2: GlobalCO2;
  nasaPowerHistory: Record<string, AnnualClimateData>;
  airQuality: AirQuality;
  openMeteoHistory: Record<string, AnnualTemperatureData>;
}

const USER_AGENT = "climate-checker/1.0";

// Geocode city to get coordinates
export const geocodeCity = async (city: string): Promise<Coordinates> => {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
      { headers: { "User-Agent": USER_AGENT } }
    );
    
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    
    const data = await res.json();
    const results = data.results;
    
    if (!results || results.length === 0) {
      throw new Error(`City '${city}' not found.`);
    }
    
    return {
      latitude: results[0].latitude,
      longitude: results[0].longitude
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    toast.error("Failed to find location. Please try another city name.");
    throw error;
  }
};

// Get current weather data
export const getCurrentWeather = async (lat: number, lon: number): Promise<CurrentWeather> => {
  try {
    const url = "https://api.open-meteo.com/v1/forecast";
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current_weather: "true",
      hourly: "relativehumidity_2m",
      timezone: "auto"
    });
    
    const res = await fetch(`${url}?${params}`, { 
      headers: { "User-Agent": USER_AGENT } 
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    
    const js = await res.json();
    const cw = js.current_weather || {};
    
    let rh = null;
    if (cw) {
      const t = cw.time;
      const times = js.hourly?.time || [];
      const hum = js.hourly?.relativehumidity_2m || [];
      
      if (times.includes(t)) {
        const index = times.indexOf(t);
        rh = hum[index];
      }
    }
    
    return {
      time: cw.time,
      temperature_c: cw.temperature,
      windspeed_kmph: cw.windspeed,
      relative_humidity_percent: rh
    };
  } catch (error) {
    console.error("Weather data error:", error);
    toast.error("Failed to fetch current weather data.");
    throw error;
  }
};

// Get global CO2 data
export const getGlobalCO2 = async (): Promise<GlobalCO2> => {
  try {
    const url = "https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_mm_mlo.txt";
    const res = await fetch(url, { 
      headers: { "User-Agent": USER_AGENT } 
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    
    const text = await res.text();
    const lines = text.split('\n')
      .filter(line => line && !line.startsWith("#"));
    
    const lastLine = lines[lines.length - 1];
    const [year, month, ppm] = lastLine.split(/\s+/).slice(0, 3).map(Number);
    
    return { 
      year: Math.floor(year), 
      month: Math.floor(month), 
      co2_ppm: ppm 
    };
  } catch (error) {
    console.error("CO2 data error:", error);
    toast.error("Failed to fetch global CO2 data.");
    throw error;
  }
};

// Get NASA POWER latest data
export const getNasaPowerData = async (lat: number, lon: number): Promise<NasaPowerData> => {
  try {
    const today = new Date();
    const buffer = 3;
    const end = new Date(today);
    end.setDate(today.getDate() - buffer);
    const endStr = end.toISOString().split('T')[0].replace(/-/g, '');
    const start = "19810101";
    
    const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOTCORR&community=RE&latitude=${lat}&longitude=${lon}&start=${start}&end=${endStr}&format=JSON`;
    
    const res = await fetch(url, { 
      headers: { "User-Agent": USER_AGENT } 
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    
    const data = await res.json();
    const p = data.properties.parameter;
    const dates = Object.keys(p.T2M).sort();
    const latest = dates[dates.length - 1];
    
    return {
      date: latest,
      temperature_c: p.T2M[latest],
      precipitation_mm: p.PRECTOTCORR[latest] || 0.0
    };
  } catch (error) {
    console.error("NASA POWER data error:", error);
    toast.error("Failed to fetch NASA POWER data.");
    throw error;
  }
};

// Get NASA POWER 10-year history
export const getNasaPowerHistory10yrs = async (lat: number, lon: number): Promise<Record<string, AnnualClimateData>> => {
  try {
    const today = new Date();
    today.setDate(today.getDate() - 3);
    
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 10);
    const start = startDate.toISOString().split('T')[0].replace(/-/g, '');
    const end = today.toISOString().split('T')[0].replace(/-/g, '');
    
    const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOTCORR&community=RE&latitude=${lat}&longitude=${lon}&start=${start}&end=${end}&format=JSON`;
    
    const res = await fetch(url, { 
      headers: { "User-Agent": USER_AGENT } 
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    
    const data = await res.json();
    const p = data.properties.parameter;
    
    // Group sums/counts by year
    interface YearStats {
      sum_t: number;
      cnt_t: number;
      sum_p: number;
    }
    
    const stats: Record<string, YearStats> = {};
    
    for (const dateStr in p.T2M) {
      const year = dateStr.substring(0, 4);
      if (!stats[year]) {
        stats[year] = { sum_t: 0, cnt_t: 0, sum_p: 0 };
      }
      stats[year].sum_t += p.T2M[dateStr];
      stats[year].cnt_t += 1;
    }
    
    for (const dateStr in p.PRECTOTCORR) {
      const year = dateStr.substring(0, 4);
      if (!stats[year]) {
        stats[year] = { sum_t: 0, cnt_t: 0, sum_p: 0 };
      }
      stats[year].sum_p += p.PRECTOTCORR[dateStr];
    }
    
    // Build result
    const out: Record<string, AnnualClimateData> = {};
    
    for (const yr of Object.keys(stats).sort()) {
      const s = stats[yr];
      const avgTemp = s.cnt_t ? Number((s.sum_t / s.cnt_t).toFixed(2)) : null;
      const totalPrecip = Number(s.sum_p.toFixed(2));
      
      out[yr] = {
        avg_temperature_c: avgTemp,
        total_precipitation_mm: totalPrecip
      };
    }
    
    return out;
  } catch (error) {
    console.error("NASA POWER history error:", error);
    toast.error("Failed to fetch NASA POWER history data.");
    throw error;
  }
};

// Get air quality data
export const getAirQuality = async (lat: number, lon: number): Promise<AirQuality> => {
  try {
    const vars = [
      "pm2_5", "pm10", "carbon_monoxide",
      "nitrogen_dioxide", "sulphur_dioxide",
      "ozone", "aerosol_optical_depth"
    ].join(",");
    
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      hourly: vars,
      timezone: "auto"
    });
    
    const res = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?${params}`,
      { headers: { "User-Agent": USER_AGENT } }
    );
    
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    
    const data = await res.json();
    const h = data.hourly;
    const idx = h.time.length - 1;
    
    const result: AirQuality = {
      timestamp: h.time[idx],
      pm2_5: h.pm2_5[idx],
      pm10: h.pm10[idx],
      carbon_monoxide: h.carbon_monoxide[idx],
      nitrogen_dioxide: h.nitrogen_dioxide[idx],
      sulphur_dioxide: h.sulphur_dioxide[idx],
      ozone: h.ozone[idx],
      aerosol_optical_depth: h.aerosol_optical_depth[idx]
    };
    
    return result;
  } catch (error) {
    console.error("Air quality error:", error);
    toast.error("Failed to fetch air quality data.");
    throw error;
  }
};

// Get Open-Meteo historical data
export const getOpenMeteoHistory10yrs = async (lat: number, lon: number): Promise<Record<string, AnnualTemperatureData>> => {
  try {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 10);
    
    const start = startDate.toISOString().split('T')[0];
    const end = today.toISOString().split('T')[0];
    
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      start_date: start,
      end_date: end,
      daily: "temperature_2m_max,temperature_2m_min",
      timezone: "auto"
    });
    
    const res = await fetch(
      `https://archive-api.open-meteo.com/v1/archive?${params}`,
      { headers: { "User-Agent": USER_AGENT } }
    );
    
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    
    const data = await res.json();
    const d = data.daily;
    
    interface YearStats {
      sum_max: number;
      cnt_max: number;
      sum_min: number;
      cnt_min: number;
    }
    
    const stats: Record<string, YearStats> = {};
    
    for (let i = 0; i < d.time.length; i++) {
      const dt = d.time[i];
      const yr = dt.substring(0, 4);
      const mx = d.temperature_2m_max[i];
      const mn = d.temperature_2m_min[i];
      
      if (!stats[yr]) {
        stats[yr] = { 
          sum_max: 0, 
          cnt_max: 0, 
          sum_min: 0, 
          cnt_min: 0 
        };
      }
      
      if (mx !== null) {
        stats[yr].sum_max += mx;
        stats[yr].cnt_max += 1;
      }
      
      if (mn !== null) {
        stats[yr].sum_min += mn;
        stats[yr].cnt_min += 1;
      }
    }
    
    const out: Record<string, AnnualTemperatureData> = {};
    
    for (const yr of Object.keys(stats).sort()) {
      const y = stats[yr];
      out[yr] = {
        avg_max_temp: y.cnt_max ? Number((y.sum_max / y.cnt_max).toFixed(2)) : null,
        avg_min_temp: y.cnt_min ? Number((y.sum_min / y.cnt_min).toFixed(2)) : null
      };
    }
    
    return out;
  } catch (error) {
    console.error("Open-Meteo history error:", error);
    toast.error("Failed to fetch temperature history data.");
    throw error;
  }
};

// Main function to get all climate data
export const getClimateData = async (city: string): Promise<ClimateData> => {
  try {
    const coordinates = await geocodeCity(city);
    const { latitude, longitude } = coordinates;
    
    // Fetch all data in parallel
    const [
      currentWeather,
      nasaPowerLatest,
      globalCO2,
      nasaPowerHistory,
      airQuality,
      openMeteoHistory
    ] = await Promise.all([
      getCurrentWeather(latitude, longitude),
      getNasaPowerData(latitude, longitude),
      getGlobalCO2(),
      getNasaPowerHistory10yrs(latitude, longitude),
      getAirQuality(latitude, longitude),
      getOpenMeteoHistory10yrs(latitude, longitude)
    ]);
    
    return {
      location: city,
      coordinates,
      currentWeather,
      nasaPowerLatest,
      globalCO2,
      nasaPowerHistory,
      airQuality,
      openMeteoHistory
    };
  } catch (error) {
    console.error("Error fetching climate data:", error);
    throw error;
  }
};
