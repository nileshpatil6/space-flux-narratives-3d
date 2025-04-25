
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface HistoryChartsProps {
  nasaData: Record<string, { avg_temperature_c: number | null; total_precipitation_mm: number }>;
  meteoData: Record<string, { avg_max_temp: number | null; avg_min_temp: number | null }>;
}

const HistoryCharts = ({ nasaData, meteoData }: HistoryChartsProps) => {
  // Process NASA POWER data for the chart
  const nasaChartData = Object.entries(nasaData).map(([year, data]) => ({
    year,
    temperature: data.avg_temperature_c,
    precipitation: data.total_precipitation_mm,
  }));

  // Process Open Meteo data for the chart
  const meteoChartData = Object.entries(meteoData).map(([year, data]) => ({
    year,
    maxTemp: data.avg_max_temp,
    minTemp: data.avg_min_temp,
  }));

  const chartConfig = {
    temperature: {
      label: "Temperature (°C)",
      theme: {
        light: "#ff4d4f",
        dark: "#ff7875",
      },
    },
    precipitation: {
      label: "Precipitation (mm)",
      theme: {
        light: "#1890ff",
        dark: "#69c0ff",
      },
    },
    maxTemp: {
      label: "Max Temperature (°C)",
      theme: {
        light: "#ff4d4f",
        dark: "#ff7875",
      },
    },
    minTemp: {
      label: "Min Temperature (°C)",
      theme: {
        light: "#1890ff",
        dark: "#69c0ff",
      },
    },
  };

  // Custom tooltip content component
  const CustomTooltipContent = (props: any) => {
    return <ChartTooltipContent {...props} indicator="line" />;
  };

  return (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>NASA POWER: 10-Year Annual Averages</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={chartConfig}
          >
            <ComposedChart data={nasaChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" orientation="left" stroke="var(--color-temperature)" />
              <YAxis yAxisId="right" orientation="right" stroke="var(--color-precipitation)" />
              <Tooltip content={<CustomTooltipContent />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temperature"
                name="Average Temperature"
                stroke="var(--color-temperature)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Bar
                yAxisId="right"
                dataKey="precipitation"
                name="Total Precipitation"
                fill="var(--color-precipitation)"
                opacity={0.7}
                barSize={20}
              />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardHeader>
          <CardTitle>Open-Meteo: 10-Year Max/Min Averages</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={chartConfig}
          >
            <ComposedChart data={meteoChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip content={<CustomTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="maxTemp"
                name="Average Max Temperature"
                stroke="var(--color-maxTemp)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="minTemp"
                name="Average Min Temperature"
                stroke="var(--color-minTemp)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryCharts;
