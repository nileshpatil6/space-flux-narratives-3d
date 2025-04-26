
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnnualClimateData, AnnualTemperatureData } from "@/services/climateDataService";
import { Bar, BarChart, CartesianGrid, Label, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface HistoryChartsProps {
  nasaData: Record<string, AnnualClimateData>;
  meteoData: Record<string, AnnualTemperatureData>;
}

const HistoryCharts = ({ nasaData, meteoData }: HistoryChartsProps) => {
  // Prepare temperature chart data
  const temperatureData = Object.keys(nasaData).map(year => {
    const nasaEntry = nasaData[year];
    const meteoEntry = meteoData[year] || { avg_max_temp: null, avg_min_temp: null };
    
    return {
      year,
      avgTemp: nasaEntry.avg_temperature_c,
      maxTemp: meteoEntry.avg_max_temp,
      minTemp: meteoEntry.avg_min_temp,
    };
  });

  // Prepare precipitation chart data
  const precipitationData = Object.keys(nasaData).map(year => ({
    year,
    precipitation: nasaData[year].total_precipitation_mm,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Temperature Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Temperature Trends</CardTitle>
          <CardDescription>10-year historical temperature data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={temperatureData}
                margin={{ top: 5, right: 30, left: 0, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year">
                  <Label value="Year" position="insideBottom" offset={-20} />
                </XAxis>
                <YAxis>
                  <Label 
                    value="Temperature (°C)" 
                    position="insideLeft"
                    angle={-90} 
                    style={{ textAnchor: 'middle' }}
                  />
                </YAxis>
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="avgTemp" 
                  stroke="#8884d8" 
                  name="Average Temperature" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="maxTemp" 
                  stroke="#ff7300" 
                  name="Average Max" 
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                />
                <Line 
                  type="monotone" 
                  dataKey="minTemp" 
                  stroke="#82ca9d" 
                  name="Average Min" 
                  strokeWidth={1.5} 
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Precipitation Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Annual Precipitation</CardTitle>
          <CardDescription>10-year historical precipitation data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={precipitationData}
                margin={{ top: 5, right: 30, left: 0, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year">
                  <Label value="Year" position="insideBottom" offset={-20} />
                </XAxis>
                <YAxis>
                  <Label 
                    value="Precipitation (mm)" 
                    position="insideLeft"
                    angle={-90} 
                    style={{ textAnchor: 'middle' }}
                  />
                </YAxis>
                <Tooltip />
                <Bar 
                  dataKey="precipitation" 
                  fill="#4f8ed0" 
                  name="Total Precipitation"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryCharts;
