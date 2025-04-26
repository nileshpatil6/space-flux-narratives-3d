
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClimateData, ClimateData } from "@/services/climateDataService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import CurrentWeatherCard from "@/components/climate/CurrentWeatherCard";
import CO2Card from "@/components/climate/CO2Card";
import NasaPowerCard from "@/components/climate/NasaPowerCard";
import AirQualityCard from "@/components/climate/AirQualityCard";
import HistoryCharts from "@/components/climate/HistoryCharts";

const Story = () => {
  const [location, setLocation] = useState("");
  const [searchedLocation, setSearchedLocation] = useState("");

  const { data, isPending, isError, error } = useQuery<ClimateData>({
    queryKey: ["climateData", searchedLocation],
    queryFn: () => getClimateData(searchedLocation),
    enabled: !!searchedLocation,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) {
      toast.error("Please enter a location name");
      return;
    }
    
    setSearchedLocation(location);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 pb-12 pt-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Climate Story
            </h1>
            <p className="mt-4 text-muted-foreground">
              Discover the climate data for any location around the world
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-xl">
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Enter a location (e.g., Paris, Tokyo, New York)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1"
                disabled={isPending}
              />
              <Button type="submit" disabled={isPending || !location.trim()}>
                {isPending ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </form>
          </div>

          {isError && (
            <div className="mx-auto mt-8 max-w-3xl">
              <Card className="border-destructive bg-destructive/10">
                <CardContent className="pt-6">
                  <p className="text-center text-destructive">
                    {error instanceof Error
                      ? error.message
                      : "An error occurred while fetching the climate data. Please try again."}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {data && (
            <div className="mt-12">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold">
                  Climate Data for {data.location}
                </h2>
                <p className="text-muted-foreground">
                  Coordinates: {data.coordinates.latitude.toFixed(4)}, {data.coordinates.longitude.toFixed(4)}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <CurrentWeatherCard data={data.currentWeather} />
                <NasaPowerCard data={data.nasaPowerLatest} />
                <CO2Card data={data.globalCO2} />
              </div>

              <div className="mt-8">
                <AirQualityCard data={data.airQuality} />
              </div>

              <div className="mt-8">
                <h3 className="mb-6 text-xl font-bold">Historical Climate Data</h3>
                <HistoryCharts 
                  nasaData={data.nasaPowerHistory} 
                  meteoData={data.openMeteoHistory} 
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Story;
