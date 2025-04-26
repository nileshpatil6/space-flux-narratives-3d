
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AirQuality } from "@/services/climateDataService";
import { Wind } from "lucide-react";

interface AirQualityCardProps {
  data: AirQuality;
}

const AirQualityCard = ({ data }: AirQualityCardProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };
  
  const getAirQualityLevel = (pm25: number): string => {
    if (pm25 <= 12) return "Good";
    if (pm25 <= 35.4) return "Moderate";
    if (pm25 <= 55.4) return "Unhealthy for Sensitive Groups";
    if (pm25 <= 150.4) return "Unhealthy";
    if (pm25 <= 250.4) return "Very Unhealthy";
    return "Hazardous";
  };
  
  const airQualityLevel = getAirQualityLevel(data.pm2_5);
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5" />
          Air Quality
        </CardTitle>
        <CardDescription>{formatDate(data.timestamp)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-lg font-semibold">
          Current Air Quality: <span className="text-primary">{airQualityLevel}</span>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <div>PM2.5</div>
            <div className="font-medium">{data.pm2_5.toFixed(2)} μg/m³</div>
          </div>
          <div className="flex items-center justify-between">
            <div>PM10</div>
            <div className="font-medium">{data.pm10.toFixed(2)} μg/m³</div>
          </div>
          <div className="flex items-center justify-between">
            <div>Ozone</div>
            <div className="font-medium">{data.ozone.toFixed(2)} μg/m³</div>
          </div>
          <div className="flex items-center justify-between">
            <div>Nitrogen Dioxide</div>
            <div className="font-medium">{data.nitrogen_dioxide.toFixed(2)} μg/m³</div>
          </div>
          <div className="flex items-center justify-between">
            <div>Sulphur Dioxide</div>
            <div className="font-medium">{data.sulphur_dioxide.toFixed(2)} μg/m³</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AirQualityCard;
