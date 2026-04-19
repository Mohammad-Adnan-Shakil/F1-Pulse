const DriverTable = ({ drivers = [] }) => {
  return (
    <div className="bg-[#1A1A22] p-6 rounded-xl mt-8">
      <h2 className="text-lg font-semibold mb-4">Driver Standings</h2>

      {drivers.length === 0 ? (
        <p className="text-gray-400 text-sm">No standings data available.</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-gray-700">
              <th className="pb-2">#</th>
              <th className="pb-2">Driver</th>
              <th className="pb-2 text-right">Points</th>
            </tr>
          </thead>

          <tbody>
            {drivers.map((driver, idx) => (
              <tr key={driver.driverId || idx} className="border-b border-gray-800 hover:bg-[#111]">
                <td className="py-3">{idx + 1}</td>
                <td>{driver.name}</td>
                <td className="text-right">{Number(driver.points || 0).toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DriverTable;
