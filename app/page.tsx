import AirportOccupancyPredictor from "@/components/AirportOccupancy";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Airport Occupancy Predictor</h1>
      <AirportOccupancyPredictor />
    </div>
  );
}
