import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, Input, SkeletonTable } from "../components/common";
import { useFetch } from "../hooks/useFetch";

const Drivers = () => {
  const { data, loading, error } = useFetch("/drivers");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("points");

  const drivers = data || [];

  const filteredDrivers = useMemo(() => {
    return drivers
      .filter((driver) => {
        const token = search.toLowerCase();
        return (
          driver.name?.toLowerCase().includes(token) ||
          driver.code?.toLowerCase().includes(token) ||
          driver.team?.toLowerCase().includes(token)
        );
      })
      .sort((a, b) => {
        const aVal = a[sortBy] || 0;
        const bVal = b[sortBy] || 0;
        return typeof aVal === "string" ? aVal.localeCompare(bVal) : bVal - aVal;
      });
  }, [drivers, search, sortBy]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Driver Standings</h1>
          <p className="text-gray-400">Loading 2026 standings...</p>
        </div>
        <SkeletonTable rows={10} cols={5} />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <p className="text-red-400 font-semibold">Unable to load drivers.</p>
        <p className="text-gray-400 mt-2 text-sm">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Driver Standings</h1>
        <p className="text-gray-400 mt-2">{filteredDrivers.length} drivers in 2026 dataset</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Input
            placeholder="Search by driver, code, or team"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
        >
          <option value="points">Sort by points</option>
          <option value="name">Sort by name</option>
          <option value="team">Sort by team</option>
        </select>
      </div>

      {filteredDrivers.length === 0 ? (
        <Card>
          <p className="text-gray-300">No drivers match your search.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredDrivers.map((driver, idx) => (
            <motion.div
              key={driver.driverId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <Card hover>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-400">#{idx + 1}</p>
                    <h3 className="text-xl text-white font-bold">{driver.name}</h3>
                    <p className="text-gray-400">{driver.code || "N/A"}</p>
                  </div>
                  <p className="text-2xl font-bold text-green-400">{Number(driver.points || 0).toFixed(0)}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <p className="text-xs text-gray-400 uppercase">Team</p>
                  <p className="text-white mt-1">{driver.team || "Unassigned"}</p>
                  <p className="text-sm text-gray-400 mt-2">{driver.nationality || "Unknown"}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Card>
        <h2 className="text-lg text-white font-bold mb-4">Leaderboard Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800 text-xs uppercase text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left">Pos</th>
                <th className="px-4 py-3 text-left">Driver</th>
                <th className="px-4 py-3 text-left">Team</th>
                <th className="px-4 py-3 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver, idx) => (
                <tr key={driver.driverId} className="border-b border-gray-800">
                  <td className="px-4 py-3 text-white font-bold">{idx + 1}</td>
                  <td className="px-4 py-3 text-white">{driver.name}</td>
                  <td className="px-4 py-3 text-gray-300">{driver.team || "Unassigned"}</td>
                  <td className="px-4 py-3 text-right text-green-400 font-semibold">
                    {Number(driver.points || 0).toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Drivers;
