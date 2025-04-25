
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GlobalCO2 } from "@/services/climateDataService";
import { Info } from "lucide-react";

interface CO2CardProps {
  data: GlobalCO2;
}

const CO2Card = ({ data }: CO2CardProps) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const monthName = monthNames[data.month - 1];
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Global CO₂ (Mauna Loa)
        </CardTitle>
        <CardDescription>{monthName} {data.year}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{data.co2_ppm.toFixed(2)} ppm</div>
        <p className="mt-2 text-sm text-muted-foreground">
          CO₂ concentration in parts per million from the Mauna Loa Observatory
        </p>
      </CardContent>
    </Card>
  );
};

export default CO2Card;
