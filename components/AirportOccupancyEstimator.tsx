"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatHour } from "@/utils/formatHour";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

// Mock API function
const fetchAirportData = async (airportCode: string, date: Date) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const occupancy = hours.map(() => Math.floor(Math.random() * 100));
  const occupancyData = hours.map((hour, index) => ({
    hour: formatHour(hour),
    occupancy: occupancy[index],
  }));
  return occupancyData;
};

const airports = [
  { code: "JFK", name: "JFK International" },
  { code: "LAX", name: "Los Angeles International" },
  { code: "ORD", name: "O'Hare International" },
  { code: "LHR", name: "Heathrow Airport" },
  { code: "HND", name: "Tokyo Haneda Airport" },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export default function AirportOccupancyEstimator() {
  const [selectedAirport, setSelectedAirport] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [occupancyData, setOccupancyData] = useState<
    { hour: string; occupancy: number }[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isToday, setIsToday] = useState(false);
  const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());

  useEffect(() => {
    setIsToday(new Date().toDateString() === date?.toDateString());
  }, [date]);

  useEffect(() => {
    const updateCurrentHour = () => {
      const now = new Date();
      setCurrentHour(now.getHours());

      const nextHour = new Date(now);
      nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
      const timeUntilNextHour = nextHour.getTime() - now.getTime();

      setTimeout(updateCurrentHour, timeUntilNextHour);
    };

    updateCurrentHour();

    return () => {
      clearTimeout(updateCurrentHour as unknown as number);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedAirport && date) {
        setIsLoading(true);
        try {
          const data = await fetchAirportData(selectedAirport, date);
          setOccupancyData(data);
        } catch (error) {
          console.error("Failed to fetch data:", error);
          // Handle error state
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [selectedAirport, date]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Select Airport and Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    "inline-flex items-center rounded-md px-4 py-2 text-sm font-medium bg-background border border-input"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "PPP")}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select onValueChange={setSelectedAirport}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select airport" />
              </SelectTrigger>
              <SelectContent>
                {airports.map((airport) => (
                  <SelectItem key={airport.code} value={airport.code}>
                    {airport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      {(isLoading || occupancyData) && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Occupancy Estimation</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-[400px]">
                <div className="animate-spin rounded-full h-[100px] w-[100px] border-b-2 border-primary"></div>
              </div>
            ) : (
              occupancyData && (
                <div className="w-full overflow-x-auto">
                  <ChartContainer
                    config={chartConfig}
                    className="w-full min-w-[800px] max-h-[400px]"
                  >
                    <BarChart accessibilityLayer data={occupancyData}>
                      <Bar dataKey="occupancy" radius={4}>
                        {Array.from({ length: 24 }, (_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index === currentHour && isToday
                                ? "#303030"
                                : "#909090"
                            }
                          />
                        ))}
                      </Bar>
                      <XAxis axisLine={false} tickLine={false} dataKey="hour" />
                    </BarChart>
                  </ChartContainer>
                </div>
              )
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
