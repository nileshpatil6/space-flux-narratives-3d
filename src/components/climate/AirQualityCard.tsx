import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AirQuality } from "@/services/climateDataService";
import { Cloud } from "lucide-react";

interface AirQualityCardProps {
  data: AirQuality;
}

// Function to get color and description based on PM2.5 level
const getPM25Class = (value: number) => {
  if (value <= 12) return { color: "text-green-500", desc: "Good" };
  if (value <= 35.4) return { color: "text-yellow-500", desc: "Moderate" };
  if (value <= 55.4) return { color: "text-orange-500", desc: "Unhealthy for Sensitive Groups" };
  if (value <= 150.4) return { color: "text-red-500", desc: "Unhealthy" };
  if (value <= 250.4) return { color: "text-purple-500", desc: "Very Unhealthy" };
  return { color: "text-red-800", desc: "Hazardous" };
};

// Function to format date
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

const AirQualityCard = ({ data }: AirQualityCardProps) => {
  const pm25Status = getPM25Class(data.pm2_5);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Air Quality
        </CardTitle>
        <CardDescription>{formatDate(data.timestamp)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* PM2.5 with prominence */}
          <div className="md:col-span-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium">PM2.5</span>
              <span className={`text-sm font-medium ${pm25Status.color}`}>
                {pm25Status.desc}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-200 dark:bg-gray-700">
              <div 
                className={`h-2.5 rounded-full ${
                  data.pm2_5 <= 12 ? "bg-green-500" :
                  data.pm2_5 <= 35.4 ? "bg-yellow-500" :
                  data.pm2_5 <= 55.4 ? "bg-orange-500" :
                  data.pm2_5 <= 150.4 ? "bg-red-500" :
                  data.pm2_5 <= 250.4 ? "bg-purple-500" : "bg-red-800"
                }`}
                style={{ width: `${Math.min(100, (data.pm2_5 / 300) * 100)}%` }}
              />
            </div>
            <div className="mt-1 text-right text-sm">
              {data.pm2_5.toFixed(1)} μg/m³
            </div>
          </div>
          
          {/* Other pollutants */}
          <div className="rounded-lg border p-3">
            <div className="font-medium">PM10</div>
            <div className="text-lg font-bold">{data.pm10.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">μg/m³</div>
          </div>
          
          <div className="rounded-lg border p-3">
            <div className="font-medium">NO₂</div>
            <div className="text-lg font-bold">{data.nitrogen_dioxide.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">μg/m³</div>
          </div>
          
          <div className="rounded-lg border p-3">
            <div className="font-medium">O₃</div>
            <div className="text-lg font-bold">{data.ozone.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">μg/m³</div>
          </div>
          
          <div className="rounded-lg border p-3">
            <div className="font-medium">CO</div>
            <div className="text-lg font-bold">{data.carbon_monoxide.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">μg/m³</div>
          </div>
          
          <div className="rounded-lg border p-3">
            <div className="font-medium">SO₂</div>
            <div className="text-lg font-bold">{data.sulphur_dioxide.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">μg/m³</div>
          </div>
          
          <div className="rounded-lg border p-3">
            <div className="font-medium">AOD</div>
            <div className="text-lg font-bold">{data.aerosol_optical_depth.toFixed(3)}</div>
            <div className="text-xs text-muted-foreground">Aerosol Optical Depth</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AirQualityCard;
