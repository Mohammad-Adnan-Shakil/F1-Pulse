import { useMemo } from "react";
import { Card, SkeletonTable } from "../components/common";
import { useAuth } from "../context/AuthContext";
import { useFetch } from "../hooks/useFetch";

const Profile = () => {
  const { user, token } = useAuth();
  const { data: profileData, loading: profileLoading, error: profileError } = useFetch("/user/me");
  const { data: drivers, loading: driversLoading } = useFetch("/drivers");
  const { data: races, loading: racesLoading } = useFetch("/races");

  const isLoading = profileLoading || driversLoading || racesLoading;
  const driversList = drivers || [];
  const racesList = races || [];

  const completedRaces = useMemo(
    () => racesList.filter((race) => race.status === "COMPLETED").length,
    [racesList]
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 bg-gray-900 border border-gray-800 rounded-xl animate-pulse" />
        <SkeletonTable rows={4} cols={3} />
      </div>
    );
  }

  if (profileError) {
    return (
      <Card>
        <p className="text-red-400 font-semibold">Unable to load profile.</p>
        <p className="text-gray-400 text-sm mt-2">{profileError}</p>
      </Card>
    );
  }

  const resolvedProfile = profileData || user || {};
  const role = String(resolvedProfile.role || user?.role || "USER").toUpperCase();

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-500/10 to-blue-500/10 border-red-500/30">
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-gray-300 mt-2">{resolvedProfile.username || "F1 Pulse User"}</p>
        <p className="text-gray-400 text-sm mt-1">{resolvedProfile.email || "No email available"}</p>
        <div className="mt-4">
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold ${
              role === "ADMIN" ? "bg-purple-500/20 text-purple-300" : "bg-blue-500/20 text-blue-300"
            }`}
          >
            {role}
          </span>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-xs uppercase text-gray-400">Drivers Loaded</p>
          <p className="text-4xl font-bold text-white mt-2">{driversList.length}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-gray-400">Completed Races</p>
          <p className="text-4xl font-bold text-green-400 mt-2">{completedRaces}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-gray-400">Upcoming Rounds</p>
          <p className="text-4xl font-bold text-yellow-300 mt-2">{Math.max(racesList.length - completedRaces, 0)}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-bold text-white mb-3">Session & Security</h2>
        <div className="space-y-2 text-sm">
          <p className="text-gray-300">JWT Status: <span className="text-green-300">{token ? "Active" : "Missing"}</span></p>
          <p className="text-gray-300">
            Token Preview: <span className="text-gray-400">{token ? `${token.slice(0, 18)}...` : "N/A"}</span>
          </p>
          <p className="text-gray-300">Access Scope: <span className="text-gray-400">{role}</span></p>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
