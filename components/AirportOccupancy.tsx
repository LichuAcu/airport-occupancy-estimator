"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Mock API function
const fetchAirportData = async (airportCode: string, date: Date) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const occupancy = hours.map(() => Math.floor(Math.random() * 100));
  return { hours, occupancy };
};

const airports = [
  { code: "JFK", name: "JFK International" },
  { code: "LAX", name: "Los Angeles International" },
  { code: "ORD", name: "O'Hare International" },
  { code: "LHR", name: "Heathrow Airport" },
  { code: "HND", name: "Tokyo Haneda Airport" },
];

export default function AirportOccupancyPredictor() {
  const [selectedAirport, setSelectedAirport] = useState("");
  const [date, setDate] = useState<Date>();
  const [occupancyData, setOccupancyData] = useState<{
    hours: number[];
    occupancy: number[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedAirport && date) {
        setIsLoading(true);
        try {
          const data = await fetchAirportData(selectedAirport, date);
          setOccupancyData(data);
        } catch (error) {
          console.error("Failed to fetch data:", error);
          // Handle error state here
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [selectedAirport, date]);

  const chartData = {
    labels: occupancyData?.hours.map((hour) => `${hour}:00`),
    datasets: [
      {
        label: "Predicted Occupancy",
        data: occupancyData?.occupancy,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Airport Occupancy",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Occupancy",
        },
      },
      x: {
        title: {
          display: true,
          text: "Hour",
        },
      },
    },
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Select Airport and Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
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
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    "inline-flex items-center rounded-md px-4 py-2 text-sm font-medium bg-background border border-input",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>
      {(isLoading || occupancyData) && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Occupancy Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
              </div>
            ) : (
              occupancyData && <Bar options={chartOptions} data={chartData} />
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
