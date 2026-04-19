import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const PointsChart = ({ data = [] }) => {
  return (
    <div className="bg-[#1A1A22] p-6 rounded-xl mt-8">
      <h2 className="text-lg font-semibold mb-4">Points Trend</h2>

      {data.length === 0 ? (
        <p className="text-gray-400 text-sm">No points trend available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="race" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="points"
              stroke="#E10600"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PointsChart;
