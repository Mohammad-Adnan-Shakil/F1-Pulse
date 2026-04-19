import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, Input } from "../components/common";
import { useFetch } from "../hooks/useFetch";

const Teams = () => {
  const { data: teamsData, loading: teamsLoading, error: teamsError } = useFetch("/constructors");
  const { data: driversData } = useFetch("/drivers");
  const [search, setSearch] = useState("");

  const teams = teamsData || [];
  const drivers = driversData || [];

  const standings = useMemo(() => {
    return teams
      .filter((team) => team.name?.toLowerCase().includes(search.toLowerCase()))
      .map((team) => {
        const teamDrivers = drivers.filter((driver) => driver.team === team.name);
        const totalPoints = teamDrivers.reduce((sum, driver) => sum + Number(driver.points || 0), 0);
        return {
          ...team,
          teamDrivers,
          totalPoints,
        };
      })
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }, [teams, drivers, search]);

  if (teamsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Constructor Standings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="h-44 bg-gray-900 border border-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (teamsError) {
    return (
      <Card>
        <p className="text-red-400 font-semibold">Unable to load constructors.</p>
        <p className="text-gray-400 mt-2 text-sm">{teamsError}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Constructor Standings</h1>
        <p className="text-gray-400 mt-2">{standings.length} teams</p>
      </div>

      <Input
        placeholder="Search constructor"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {standings.length === 0 ? (
        <Card>
          <p className="text-gray-300">No constructor matches your search.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {standings.map((team, idx) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <Card hover>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Position {idx + 1}</p>
                    <h2 className="text-xl text-white font-bold mt-1">{team.name}</h2>
                    <p className="text-gray-400 mt-1">{team.nationality}</p>
                  </div>
                  <p className="text-3xl text-red-400 font-bold">{team.totalPoints.toFixed(0)}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-800 space-y-2">
                  <p className="text-xs uppercase text-gray-400">Driver Pairing</p>
                  {team.teamDrivers.length === 0 ? (
                    <p className="text-gray-500 text-sm">No drivers mapped yet.</p>
                  ) : (
                    team.teamDrivers.map((driver) => (
                      <div key={driver.driverId} className="flex justify-between text-sm">
                        <span className="text-white">{driver.name}</span>
                        <span className="text-green-400">{Number(driver.points || 0).toFixed(0)} pts</span>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;
