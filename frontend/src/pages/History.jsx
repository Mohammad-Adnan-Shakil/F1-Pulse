import { useState, useEffect } from "react";
import { Card } from "../components/common/Card";
import { Loader } from "../components/common/Loader";
import { Flag, Trophy, Users } from "lucide-react";

/**
 * Season Browser Page
 * Browse all F1 seasons from 1950-2026
 */
const History = () => {
  useEffect(() => {
    document.title = "History | F1 Pulse";
  }, []);

  const [seasons, setSeasons] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [seasonDetail, setSeasonDetail] = useState(null);
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/historical/seasons");
        
        if (!response.ok) {
          throw new Error("Failed to fetch seasons");
        }

        const data = await response.json();
        setSeasons(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasons();
  }, []);

  useEffect(() => {
    const fetchSeasonDetail = async () => {
      if (!selectedYear) return;
      
      try {
        const response = await fetch(`http://localhost:8080/api/historical/season/${selectedYear}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch season detail");
        }

        const data = await response.json();
        setSeasonDetail(data.season);
        setRaces(data.races || []);
      } catch (err) {

      }
    };

    fetchSeasonDetail();
  }, [selectedYear]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500">
          <p className="text-xl font-bold mb-2">Error Loading History</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-whitePrimary mb-2">F1 History</h1>
        <p className="text-whiteMuted">Browse F1 seasons from 1950 to present</p>
      </div>

      {/* Year Selector */}
      <div className="space-y-2">
        <label className="text-whitePrimary font-medium block">Select Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="w-full md:w-64 px-4 py-2 bg-bgSecondary border border-borderSoft rounded-lg text-whitePrimary focus:outline-none focus:border-accentRed"
        >
          {seasons.map((season) => (
            <option key={season.id} value={season.year}>
              {season.year}
            </option>
          ))}
        </select>
      </div>

      {/* Season Overview */}
      {seasonDetail && (
        <Card className="p-6 bg-gradient-to-r from-accentRed/10 to-transparent">
          <h2 className="text-2xl font-bold text-whitePrimary mb-4">{seasonDetail.year} Season</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-whiteMuted text-sm mb-1">Total Races</p>
              <p className="text-2xl font-bold text-accentRed">{seasonDetail.totalRounds}</p>
            </div>
            {seasonDetail.championDriverId && (
              <div>
                <p className="text-whiteMuted text-sm mb-1">Driver Champion</p>
                <p className="text-lg font-bold text-whitePrimary">Champion Driver</p>
              </div>
            )}
            {seasonDetail.championConstructorId && (
              <div>
                <p className="text-whiteMuted text-sm mb-1">Constructor Champion</p>
                <p className="text-lg font-bold text-whitePrimary">Champion Team</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Races Grid */}
      <div>
        <h3 className="text-xl font-bold text-whitePrimary mb-4">Races</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {races.length > 0 ? (
            races.map((race) => (
              <Card key={race.id} className="p-4 hover:border-accentRed/50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-whiteMuted text-xs">Round {race.round}</p>
                    <h4 className="text-whitePrimary font-bold">{race.raceName}</h4>
                  </div>
                  <Flag className="h-5 w-5 text-accentRed flex-shrink-0" />
                </div>
                <p className="text-whiteMuted text-sm mb-3">{race.circuitName}</p>
                <p className="text-whiteMuted text-xs">{race.circuitCountry}</p>
                {race.raceDate && (
                  <p className="text-whiteMuted text-xs mt-2">
                    {new Date(race.raceDate).toLocaleDateString()}
                  </p>
                )}
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-whiteMuted">No races found for this season</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
