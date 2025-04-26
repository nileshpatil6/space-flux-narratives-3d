
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CurrentWeather } from "@/services/climateDataService";
import { Wind, Thermometer, Droplets } from "lucide-react";

interface CurrentWeatherCardProps {
  data: CurrentWeather;
}

const CurrentWeatherCard = ({ data }: CurrentWeatherCardProps) => {
  const dateTime = new Date(data.time).toLocaleString();
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5" />
          Current Weather
        </CardTitle>
        <CardDescription>{dateTime}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <Thermometer className="h-4 w-4 text-primary" />
            <div className="font-medium">Temperature</div>
            <div className="ml-auto">{data.temperature_c}°C</div>
          </div>
          <div className="flex items-center gap-3">
            <Wind className="h-4 w-4 text-primary" />
            <div className="font-medium">Wind Speed</div>
            <div className="ml-auto">{data.windspeed_kmph} km/h</div>
          </div>
          {data.relative_humidity_percent !== null && (
            <div className="flex items-center gap-3">
              <Droplets className="h-4 w-4 text-primary" />
              <div className="font-medium">Relative Humidity</div>
              <div className="ml-auto">{data.relative_humidity_percent}%</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeatherCard;
