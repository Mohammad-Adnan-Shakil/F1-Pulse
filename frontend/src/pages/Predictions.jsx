import { Card } from "../components/common";
import { useFetch } from "../hooks/useFetch";

const Predictions = () => {
  const { data: races, loading, error } = useFetch("/races");

  if (loading) {
    return <p className="text-gray-400">Loading prediction opportunities...</p>;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  const upcoming = (races || []).filter((race) => race.status !== "COMPLETED").slice(0, 4);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-white">Prediction Queue</h1>
      {upcoming.length === 0 ? (
        <Card>
          <p className="text-gray-300">No upcoming races available for predictions.</p>
        </Card>
      ) : (
        upcoming.map((race) => (
          <Card key={race.raceId}>
            <p className="text-xs uppercase text-gray-400">Round {race.round}</p>
            <h3 className="text-xl text-white font-bold mt-1">{race.raceName}</h3>
            <p className="text-gray-400 mt-1">{race.location}, {race.country}</p>
            <p className="text-gray-400 text-sm mt-1">{race.date}</p>
          </Card>
        ))
      )}
    </div>
  );
};

export default Predictions;
