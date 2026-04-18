import { useEffect, useState } from "react";
import api from "../utils/axios";

const AIPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [races, setRaces] = useState([]);

  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedRace, setSelectedRace] = useState("");
  const [position, setPosition] = useState(1);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 🔄 Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversRes, racesRes] = await Promise.all([
          api.get("/drivers"),
          api.get("/races"),
        ]);

        setDrivers(driversRes.data);
        setRaces(racesRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // 🧠 Run AI
  const runAI = async () => {
    if (!selectedDriver || !selectedRace) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await api.post("/ai/intelligence", {
        driverId: selectedDriver,
        raceId: selectedRace,
        simulatedPosition: position,
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-6 h-full">

      {/* LEFT — CONTROL PANEL */}
      <div className="w-[35%] surface space-y-6">

        <div>
          <h2 className="font-display text-2xl tracking-widePlus">
            INTELLIGENCE ENGINE
          </h2>
          <div className="racing-divider"></div>
        </div>

        {/* Driver Selector */}
        <div>
          <label className="text-sm text-textSecondary block mb-1">
            Driver
          </label>
          <select
            className="input-field"
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
          >
            <option value="">Select Driver</option>
            {drivers.map((d) => (
              <option key={d.driverId} value={d.driverId}>
                {d.name} ({d.team})
              </option>
            ))}
          </select>
        </div>

        {/* Race Selector */}
        <div>
          <label className="text-sm text-textSecondary block mb-1">
            Race
          </label>
          <select
            className="input-field"
            value={selectedRace}
            onChange={(e) => setSelectedRace(e.target.value)}
          >
            <option value="">Select Race</option>
            {races.map((r) => (
              <option key={r.raceId} value={r.raceId}>
                {r.name} — {r.location}
              </option>
            ))}
          </select>
        </div>

        {/* Position Slider */}
        <div>
          <label className="text-sm text-textSecondary block mb-2">
            Simulated Position
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="20"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full"
            />
            <span className="font-mono text-xl">{position}</span>
          </div>
        </div>

        {/* Run Button */}
        <button
          onClick={runAI}
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? "RUNNING..." : "RUN INTELLIGENCE"}
        </button>
      </div>

      {/* RIGHT — RESULTS PANEL */}
      <div className="w-[65%] space-y-6 overflow-y-auto">

        {!result && !loading && (
          <div className="card text-center text-textSecondary">
            Select inputs and run intelligence
          </div>
        )}

        {loading && (
          <div className="card text-center font-mono text-xl">
            ANALYZING...
          </div>
        )}

        {result && (
          <>
            {/* Prediction */}
            <div className="card flex items-center justify-between">
              <div>
                <p className="text-textSecondary">Predicted Position</p>
                <h1 className="text-5xl font-mono gold-text">
                  P{result.prediction.predictedPosition}
                </h1>
              </div>

              <div>
                <p className="text-textSecondary">Confidence</p>
                <p className="font-mono text-xl">
                  {(result.prediction.confidence * 100).toFixed(0)}%
                </p>
              </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-3 gap-4">
              <div className="card">
                <p className="text-textSecondary">Average Finish</p>
                <p className="stat-number">
                  {result.insights.averageFinish}
                </p>
              </div>

              <div className="card">
                <p className="text-textSecondary">Consistency</p>
                <p className="stat-number">
                  {result.insights.consistencyScore}
                </p>
              </div>

              <div className="card">
                <p className="text-textSecondary">Trend</p>
                <p className="stat-number">
                  {result.insights.trend}
                </p>
              </div>
            </div>

            {/* Simulation */}
            <div className="card">
              <p className="text-textSecondary mb-2">Simulation Impact</p>

              <div className="flex justify-between">
                <div>
                  <p className="text-textSecondary">Before</p>
                  <p className="stat-number">
                    {result.simulation.oldAverage}
                  </p>
                </div>

                <div>
                  <p className="text-textSecondary">After</p>
                  <p className="stat-number">
                    {result.simulation.newAverage}
                  </p>
                </div>

                <div>
                  <p className="text-textSecondary">Impact</p>
                  <p
                    className={`stat-number ${
                      result.simulation.impact === "POSITIVE"
                        ? "text-success"
                        : result.simulation.impact === "NEGATIVE"
                        ? "text-danger"
                        : ""
                    }`}
                  >
                    {result.simulation.impact}
                  </p>
                </div>
              </div>
            </div>

            {/* Comparison */}
            <div className="card">
              <p className="text-textSecondary mb-2">Driver Comparison</p>

              <div className="flex justify-between">
                <span>{result.comparison.driverA}</span>
                <span className="gold-text font-display">VS</span>
                <span>{result.comparison.driverB}</span>
              </div>

              <p className="mt-4 text-center gold-text font-display">
                {result.comparison.betterDriver} is stronger
              </p>
            </div>

            {/* Summary */}
            <div className="card border-l-4 border-primary">
              <p className="text-textSecondary mb-2 font-display">
                AI ANALYSIS
              </p>
              <p>{result.summary}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIPage;