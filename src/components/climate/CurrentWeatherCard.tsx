
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CurrentWeather } from "@/services/climateDataService";
import { Thermometer, Wind, Droplet } from "lucide-react";

interface CurrentWeatherCardProps {
  data: CurrentWeather;
}

const CurrentWeatherCard = ({ data }: CurrentWeatherCardProps) => {
  // Format the date for more readable display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5" />
          Current Weather
        </CardTitle>
        <CardDescription>{formatDate(data.time)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Thermometer className="h-4 w-4 text-primary" />
            <div className="font-medium">Temperature</div>
            <div className="ml-auto text-lg font-medium">{data.temperature_c.toFixed(1)}°C</div>
          </div>
          
          <div className="flex items-center gap-3">
            <Wind className="h-4 w-4 text-primary" />
            <div className="font-medium">Wind Speed</div>
            <div className="ml-auto">{data.windspeed_kmph.toFixed(1)} km/h</div>
          </div>
          
          {data.relative_humidity_percent !== null && (
            <div className="flex items-center gap-3">
              <Droplet className="h-4 w-4 text-primary" />
              <div className="font-medium">Humidity</div>
              <div className="ml-auto">{data.relative_humidity_percent.toFixed(0)}%</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeatherCard;
