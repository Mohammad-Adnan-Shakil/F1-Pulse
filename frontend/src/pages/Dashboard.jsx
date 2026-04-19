import { useFetch } from "../hooks/useFetch";
import { Card, SkeletonTable } from "../components/common";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = () => {
  const { data: drivers, loading: driversLoading, error: driversError } = useFetch("/drivers");
  const { data: races, loading: racesLoading, error: racesError } = useFetch("/races");

  const driverList = drivers || [];
  const raceList = races || [];

  const isLoading = driversLoading || racesLoading;
  const hasError = driversError || racesError;

  const completedRaces = raceList.filter((race) => race.status === "COMPLETED");
  const upcomingRaces = raceList.filter((race) => race.status !== "COMPLETED");

  const topDriver = driverList[0] || null;
  const topTeam = Object.values(
    driverList.reduce((acc, driver) => {
      const key = driver.team || "Unknown";
      if (!acc[key]) {
        acc[key] = { name: key, points: 0 };
      }
      acc[key].points += Number(driver.points || 0);
      return acc;
    }, {})
  ).sort((a, b) => b.points - a.points)[0];

  const driverChartData = driverList.slice(0, 8).map((driver) => ({
    name: driver.code || driver.name,
    points: Number(driver.points || 0),
  }));

  const raceProgressData = raceList.map((race) => ({
    round: `R${race.round}`,
    completed: race.status === "COMPLETED" ? 1 : 0,
  }));

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="h-28 rounded-xl border border-gray-800 bg-gray-900 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="h-80 rounded-xl border border-gray-800 bg-gray-900 animate-pulse" />
          ))}
        </div>
        <SkeletonTable rows={6} cols={4} />
      </div>
    );
  }

  if (hasError) {
    return (
      <Card>
        <p className="text-red-400 font-semibold">Unable to load dashboard data.</p>
        <p className="text-gray-400 mt-2 text-sm">{driversError || racesError}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-white">2026 Season Command Center</h1>
        <p className="text-gray-400 mt-2">Live standings and race calendar from PostgreSQL</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Drivers</p>
          <p className="text-4xl font-bold text-white mt-2">{driverList.length}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Completed Races</p>
          <p className="text-4xl font-bold text-green-400 mt-2">{completedRaces.length}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Top Driver</p>
          <p className="text-lg font-bold text-white mt-2">{topDriver?.name || "No data"}</p>
          <p className="text-sm text-gray-400 mt-1">{Number(topDriver?.points || 0).toFixed(0)} pts</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Top Team</p>
          <p className="text-lg font-bold text-white mt-2">{topTeam?.name || "No data"}</p>
          <p className="text-sm text-gray-400 mt-1">{Number(topTeam?.points || 0).toFixed(0)} pts</p>
        </Card>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <h2 className="text-lg font-bold text-white mb-4">Driver Standings</h2>
          {driverChartData.length === 0 ? (
            <p className="text-gray-400">No driver data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={driverChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151" }}
                  formatter={(value) => `${value} pts`}
                />
                <Bar dataKey="points" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-white mb-4">Race Progress</h2>
          {raceProgressData.length === 0 ? (
            <p className="text-gray-400">No race calendar data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={raceProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="round" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" allowDecimals={false} domain={[0, 1]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151" }}
                  formatter={(value) => (value === 1 ? "Completed" : "Scheduled")}
                />
                <Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">Upcoming Races</h2>
        <Card>
          {upcomingRaces.length === 0 ? (
            <p className="text-gray-400">No upcoming races in the calendar.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-800 text-gray-400 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Round</th>
                    <th className="px-4 py-3 text-left">Race</th>
                    <th className="px-4 py-3 text-left">Location</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingRaces.slice(0, 6).map((race) => (
                    <tr key={race.raceId} className="border-b border-gray-800">
                      <td className="px-4 py-3 text-white">{race.round}</td>
                      <td className="px-4 py-3 text-white font-semibold">{race.raceName}</td>
                      <td className="px-4 py-3 text-gray-300">{race.location}, {race.country}</td>
                      <td className="px-4 py-3 text-gray-300">{race.date}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300">
                          {race.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
