import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, Button, Loader } from "../components/common";
import { useFetch, usePost } from "../hooks/useFetch";

const AIPage = () => {
  const { data: drivers, loading: driversLoading } = useFetch("/drivers");
  const { data: races, loading: racesLoading } = useFetch("/races");
  const { execute: runPrediction, loading } = usePost("/ai/intelligence");

  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedRace, setSelectedRace] = useState("");
  const [simulatedPosition, setSimulatedPosition] = useState(10);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const driverList = drivers || [];
  const raceList = races || [];

  const selectedDriverData = useMemo(
    () => driverList.find((driver) => driver.driverId === Number(selectedDriver)),
    [driverList, selectedDriver]
  );

  const upcomingRaces = useMemo(
    () => raceList.filter((race) => race.status !== "COMPLETED"),
    [raceList]
  );

  const handlePrediction = async () => {
    if (!selectedDriver || !selectedRace) {
      setError("Select both driver and race before running prediction.");
      return;
    }

    try {
      setError("");
      const response = await runPrediction({
        driverId: Number(selectedDriver),
        raceId: Number(selectedRace),
        simulatedPosition,
      });
      setResult(response);
    } catch (err) {
      setError(err.message || "Prediction failed");
    }
  };

  const isSetupLoading = driversLoading || racesLoading;
  const confidencePercent = (() => {
    const raw = Number(result?.prediction?.confidence ?? 0);
    const normalized = raw <= 1 ? raw * 100 : raw;
    return Math.max(0, Math.min(100, Math.round(normalized)));
  })();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">AI Race Prediction</h1>
        <p className="text-gray-400 mt-2">ML-powered race outcome, insights, and what-if simulation</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-1">
          <h2 className="text-lg text-white font-bold mb-4">Prediction Setup</h2>

          {isSetupLoading ? (
            <Loader message="Loading driver and race data..." />
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Driver</label>
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                >
                  <option value="">Select driver</option>
                  {driverList.map((driver) => (
                    <option key={driver.driverId} value={driver.driverId}>
                      {driver.code || driver.name} - {driver.team || "Unassigned"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Race</label>
                <select
                  value={selectedRace}
                  onChange={(e) => setSelectedRace(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                >
                  <option value="">Select race</option>
                  {upcomingRaces.map((race) => (
                    <option key={race.raceId} value={race.raceId}>
                      R{race.round} - {race.raceName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">What-if Grid Position: P{simulatedPosition}</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={simulatedPosition}
                  onChange={(e) => setSimulatedPosition(Number(e.target.value))}
                  className="w-full accent-red-500"
                />
              </div>

              {selectedDriverData && (
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-3 text-sm">
                  <p className="text-white font-semibold">{selectedDriverData.name}</p>
                  <p className="text-gray-400">{selectedDriverData.team || "Unassigned"}</p>
                  <p className="text-green-400 mt-1">{Number(selectedDriverData.points || 0).toFixed(0)} points</p>
                </div>
              )}

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <Button
                onClick={handlePrediction}
                disabled={loading || !selectedDriver || !selectedRace}
                className="w-full"
              >
                {loading ? "Running ML prediction..." : "Run Prediction"}
              </Button>
            </div>
          )}
        </Card>

        <div className="xl:col-span-2 space-y-4">
          {!result && !loading && (
            <Card className="min-h-[280px] flex items-center justify-center">
              <p className="text-gray-400">Choose inputs and run prediction to view AI output.</p>
            </Card>
          )}

          {loading && (
            <Card className="min-h-[280px] flex items-center justify-center">
              <Loader size="lg" message="Running Python models..." />
            </Card>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <Card className="border-red-500/50 bg-red-500/5">
                <p className="text-xs uppercase text-gray-400">Predicted Finish</p>
                <div className="flex items-end justify-between mt-2">
                  <p className="text-5xl font-bold text-red-400">
                    P{result.prediction?.predictedPosition != null
                      ? Number(result.prediction.predictedPosition).toFixed(2)
                      : "-"}
                  </p>
                  <p className="text-xl text-white">
                    Confidence: {confidencePercent}%
                  </p>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <p className="text-xs uppercase text-gray-400">Average Finish</p>
                  <p className="text-3xl text-blue-300 font-bold mt-2">
                    P{result.insights?.averageFinish != null
                      ? Number(result.insights.averageFinish).toFixed(2)
                      : "-"}
                  </p>
                </Card>
                <Card>
                  <p className="text-xs uppercase text-gray-400">Consistency</p>
                  <p className="text-3xl text-green-300 font-bold mt-2">
                    {Math.round((result.insights?.consistencyScore || 0) * 100)}%
                  </p>
                </Card>
                <Card>
                  <p className="text-xs uppercase text-gray-400">Trend</p>
                  <p className="text-3xl text-yellow-300 font-bold mt-2">{result.insights?.trend || "-"}</p>
                </Card>
              </div>

              <Card>
                <h3 className="text-white font-bold">What-if Simulation</h3>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-xs uppercase text-gray-400">Current Avg</p>
                    <p className="text-2xl text-red-300 font-bold mt-1">
                      P{result.simulation?.oldAverage != null
                        ? Number(result.simulation.oldAverage).toFixed(2)
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-400">Projected Avg</p>
                    <p className="text-2xl text-green-300 font-bold mt-1">
                      P{result.simulation?.newAverage != null
                        ? Number(result.simulation.newAverage).toFixed(2)
                        : "-"}
                    </p>
                  </div>
                </div>
                <p className="text-gray-300 mt-3 text-sm">Impact: {result.simulation?.impact || "N/A"}</p>
              </Card>

              <Card>
                <h3 className="text-white font-bold">Performance Insight</h3>
                <p className="text-gray-300 mt-2 text-sm leading-6">{result.summary || "No summary returned."}</p>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPage;
