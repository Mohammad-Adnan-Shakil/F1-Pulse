import { useEffect, useState } from "react";
import api from "../utils/axios";

const Dashboard = () => {
  const [drivers, setDrivers] = useState([]);
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="card">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">

      {/* 🔥 TOP STATS */}
      <div className="grid grid-cols-3 gap-6">

        <div className="card">
          <p className="text-textSecondary">Total Drivers</p>
          <p className="stat-number">{drivers.length}</p>
        </div>

        <div className="card">
          <p className="text-textSecondary">Total Races</p>
          <p className="stat-number">{races.length}</p>
        </div>

        <div className="card">
          <p className="text-textSecondary">Top Driver</p>
          <p className="stat-number">
            {drivers[0]?.name || "N/A"}
          </p>
        </div>

      </div>

      {/* 🏁 RECENT DRIVERS */}
      <div className="card">
        <h2 className="text-xl mb-4">Top Drivers</h2>

        <div className="space-y-3">
          {drivers.slice(0, 5).map((d) => (
            <div
              key={d.driverId}
              className="flex justify-between border-b border-border pb-2"
            >
              <span>{d.name}</span>
              <span className="text-textSecondary">{d.team}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 🏎️ UPCOMING RACES */}
      <div className="card">
        <h2 className="text-xl mb-4">Upcoming Races</h2>

        <div className="space-y-3">
          {races.slice(0, 5).map((r) => (
            <div
              key={r.raceId}
              className="flex justify-between border-b border-border pb-2"
            >
              <span>{r.name}</span>
              <span className="text-textSecondary">{r.location}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;