
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NasaPowerData } from "@/services/climateDataService";
import { Thermometer, Cloud } from "lucide-react";

interface NasaPowerCardProps {
  data: NasaPowerData;
}

const NasaPowerCard = ({ data }: NasaPowerCardProps) => {
  const formatDate = (dateStr: string) => {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}-${month}-${day}`;
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>NASA POWER Data</CardTitle>
        <CardDescription>{formatDate(data.date)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <Thermometer className="h-4 w-4 text-primary" />
            <div className="font-medium">Temperature</div>
            <div className="ml-auto">{data.temperature_c.toFixed(2)}°C</div>
          </div>
          <div className="flex items-center gap-3">
            <Cloud className="h-4 w-4 text-primary" />
            <div className="font-medium">Precipitation</div>
            <div className="ml-auto">{data.precipitation_mm.toFixed(2)} mm</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NasaPowerCard;
