
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, Thermometer, Droplet, MapPin, Loader } from "lucide-react";
import { getClimateData, type ClimateData } from "@/services/climateDataService";
import Navbar from "@/components/layout/Navbar";

export default function Story() {
  const [location, setLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const { data: climateData, isPending, isError, error } = useQuery<ClimateData>({
    queryKey: ["climate", searchTerm],
    queryFn: () => getClimateData(searchTerm!),
    enabled: !!searchTerm, // Only run query when searchTerm is set
    retry: 1,
  });

  const handleSearch = () => {
    if (location.trim()) {
      setSearchTerm(location.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold mb-8">Climate Story</h1>
        
        <div className="flex gap-4 mb-8">
          <div className="relative w-full max-w-md">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Enter location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10"
              disabled={isPending}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && location.trim()) {
                  handleSearch();
                }
              }}
            />
          </div>
          <Button onClick={handleSearch} disabled={!location.trim() || isPending}>
            {isPending ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>

        {isError && (
          <div className="p-4 mb-8 bg-destructive/10 text-destructive rounded-md">
            <p>Error loading climate data: {error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        )}

        {/* Only show the loading state if a search has been initiated */}
        {isPending && searchTerm && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Fetching climate data...</p>
          </div>
        )}

        {/* Only show climate data if it exists */}
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

        {/* Show initial message when no search has been made yet */}
        {!searchTerm && !isPending && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">Enter a location and press Search to view climate data</p>
          </div>
        )}
      </div>
    </div>
  );
}
