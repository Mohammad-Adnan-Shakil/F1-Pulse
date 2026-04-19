import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Flag, Trophy, Users, Zap } from "lucide-react";
import { Card, AnimatedCount, LoadingState, ErrorState, EmptyState } from "../components/common";
import useFetch from "../hooks/useFetch";
import usePageTitle from "../hooks/usePageTitle";

const StatCard = ({ icon: Icon, label, value, subValue, accentClass = "text-whitePrimary", delay = 0 }) => (
  <Card delay={delay} className="relative overflow-hidden p-5">
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accentRed/20 text-accentRed">
        <Icon className="h-4 w-4" />
      </div>
      <p className="section-label">{label}</p>
    </div>

    {typeof value === "number" ? (
      <p className={`hero-number text-[42px] ${accentClass}`}>
        <AnimatedCount value={value} />
      </p>
    ) : (
      <p className={`text-2xl font-semibold ${accentClass}`}>{value}</p>
    )}

    {subValue ? <p className="mt-1 text-sm text-whiteMuted">{subValue}</p> : null}
    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-accentRed/70 via-accentRed to-transparent" />
  </Card>
);

const Dashboard = () => {
  usePageTitle("Dashboard");

  const { data: drivers, loading: driversLoading, error: driversError, refetch: refetchDrivers } = useFetch("/drivers");
  const { data: races, loading: racesLoading, error: racesError, refetch: refetchRaces } = useFetch("/races");

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isLoading = driversLoading || racesLoading;
  const hasError = driversError || racesError;

  const driverList = drivers || [];
  const raceList = (races || []).slice().sort((a, b) => (a.round ?? 999) - (b.round ?? 999));

  const completedRaces = raceList.filter((race) => race.status === "COMPLETED");
  const upcomingRaces = raceList.filter((race) => race.status !== "COMPLETED");

  const topDriver = driverList[0] || { name: "Andrea Kimi Antonelli", points: 72 };

  const topTeam = useMemo(() => {
    const grouped = Object.values(
      driverList.reduce((acc, driver) => {
        const key = driver.team || "Mercedes";
        if (!acc[key]) acc[key] = { name: key, points: 0 };
        acc[key].points += Number(driver.points || 0);
        return acc;
      }, {})
    ).sort((a, b) => b.points - a.points);

    return grouped[0] || { name: "Mercedes", points: 135 };
  }, [driverList]);

  const standingsData = driverList.slice(0, 8);
  const maxPoints = Math.max(...standingsData.map((d) => Number(d.points || 0)), 1);

  const progressData = raceList.map((race, idx) => {
    const completedCountAtPoint = raceList
      .slice(0, idx + 1)
      .filter((entry) => entry.status === "COMPLETED").length;

    const progressValue = race.status === "COMPLETED" ? completedCountAtPoint : completedRaces.length;

    return {
      round: `R${race.round}`,
      progress: progressValue,
      status: race.status,
    };
  });

  if (isLoading) {
    return <LoadingState message="Loading command center data..." />;
  }

  if (hasError) {
    return (
      <ErrorState
        message={driversError || racesError}
        onRetry={() => {
          refetchDrivers();
          refetchRaces();
        }}
      />
    );
  }

  if (!driverList.length || !raceList.length) {
    return <EmptyState title="Dashboard is empty" description="Sync data from backend and refresh." />;
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-xl2 border border-borderSoft bg-bgElevated p-6 md:flex-row md:items-center">
        <div>
          <p className="section-label">Season Overview</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            <span className="text-whitePrimary">2026 SEASON</span> <span className="text-accentRed">COMMAND CENTER</span>
          </h1>
          <p className="mt-2 text-sm text-whiteMuted">Real-time standings, race progress, and race intelligence at a glance.</p>
        </div>

        <div className="rounded-xl2 border border-borderSoft bg-bgCard px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-2 text-xs uppercase tracking-[0.2em] text-whiteMuted">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accentRed" /> LIVE
          </div>
          <p className="mt-2 text-2xl font-semibold text-whitePrimary">
            {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Drivers" value={driverList.length || 22} delay={0.05} />
        <StatCard icon={Flag} label="Completed Races" value={completedRaces.length || 3} accentClass="text-successGreen" delay={0.1} />
        <StatCard icon={Trophy} label="Top Driver" value={topDriver.name} subValue={`${Math.round(topDriver.points || 0)} pts`} delay={0.15} />
        <StatCard icon={Zap} label="Top Team" value={topTeam.name} subValue={`${Math.round(topTeam.points || 0)} pts`} delay={0.2} />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card delay={0.25}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-whitePrimary">Driver Standings</h2>
            <p className="section-label">Top 8</p>
          </div>

          <div className="space-y-3">
            {standingsData.map((driver, index) => {
              const points = Number(driver.points || 0);
              const widthPct = Math.max((points / maxPoints) * 100, 6);
              const isTop = index === 0;

              return (
                <div key={driver.driverId || driver.code} className="grid grid-cols-[64px_1fr_40px] items-center gap-3">
                  <span className="text-sm font-semibold text-whiteMuted">{driver.code || "DRV"}</span>
                  <div className="h-8 overflow-hidden rounded-lg bg-white/5">
                    <div
                      className="h-full rounded-lg transition-all duration-700"
                      style={{
                        width: `${widthPct}%`,
                        background: isTop
                          ? "linear-gradient(90deg,#ffd700,#ffeb85)"
                          : "linear-gradient(90deg,#e8002d,#ff4d6d)",
                      }}
                    />
                  </div>
                  <span className="text-right text-sm font-semibold text-whitePrimary">{Math.round(points)}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card delay={0.3}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-whitePrimary">Race Progress</h2>
            <p className="section-label">Completion Curve</p>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="raceProgressFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(232,0,45,0.3)" />
                  <stop offset="100%" stopColor="rgba(232,0,45,0)" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
              <XAxis dataKey="round" stroke="rgba(255,255,255,0.6)" />
              <YAxis allowDecimals={false} domain={[0, raceList.length]} stroke="rgba(255,255,255,0.6)" />
              <Tooltip
                contentStyle={{
                  background: "#141420",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                }}
                formatter={(value) => [`${value} completed races`, "Progress"]}
              />
              <Area type="monotone" dataKey="progress" stroke="#e8002d" strokeWidth={3} fill="url(#raceProgressFill)" dot={({ cx, cy, payload }) => (
                <circle
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill={payload.status === "COMPLETED" ? "#e8002d" : "#141420"}
                  stroke={payload.status === "COMPLETED" ? "#e8002d" : "rgba(255,255,255,0.4)"}
                  strokeWidth={2}
                />
              )} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </section>

      <Card delay={0.35}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-whitePrimary">Upcoming Races</h2>
          <p className="section-label">Next 6</p>
        </div>

        <div className="space-y-2">
          {upcomingRaces.slice(0, 6).map((race) => (
            <div key={race.raceId} className="rounded-xl2 border border-white/5 bg-bgElevated px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-whitePrimary">R{race.round} · {race.raceName}</p>
                  <p className="text-xs text-whiteMuted">{race.circuitName} · {race.location}, {race.country}</p>
                </div>
                <p className="text-xs text-whiteMuted">{race.date}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

