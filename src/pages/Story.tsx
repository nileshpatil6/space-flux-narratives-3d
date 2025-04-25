
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, Thermometer, Droplet } from "lucide-react";
import { getClimateData, type ClimateData } from "@/services/climateDataService";

export default function Story() {
  const [location, setLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const { data: climateData, isPending } = useQuery<ClimateData>({
    queryKey: ["climate", searchTerm],
    queryFn: () => getClimateData(searchTerm!),
    enabled: !!searchTerm,
  });

  const handleSearch = () => {
    if (location.trim()) {
      setSearchTerm(location.trim());
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Climate Story</h1>
      
      <div className="flex gap-4 mb-8">
        <Input
          placeholder="Enter location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="max-w-md"
          disabled={isPending}
        />
        <Button onClick={handleSearch} disabled={!location.trim() || isPending}>
          {isPending ? "Searching..." : "Search"}
        </Button>
      </div>

      {isPending && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Fetching climate data...</p>
        </div>
      )}

      {climateData && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Current Weather</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="text-red-500" />
                  <span>Temperature: {climateData.currentWeather.temperature_c}°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="text-blue-500" />
                  <span>Wind Speed: {climateData.currentWeather.windspeed_kmph} km/h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplet className="text-blue-400" />
                  <span>
                    Humidity: {climateData.currentWeather.relative_humidity_percent}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Air Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>PM2.5: {climateData.airQuality.pm2_5} µg/m³</p>
                <p>PM10: {climateData.airQuality.pm10} µg/m³</p>
                <p>CO: {climateData.airQuality.carbon_monoxide} ppm</p>
                <p>NO₂: {climateData.airQuality.nitrogen_dioxide} ppb</p>
                <p>O₃: {climateData.airQuality.ozone} ppb</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Global CO₂</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {climateData.globalCO2.co2_ppm}
                </p>
                <p className="text-sm text-muted-foreground">PPM</p>
                <p className="mt-2">
                  {climateData.globalCO2.month}/{climateData.globalCO2.year}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
