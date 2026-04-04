const PredictionCard = ({ race, driver, confidence }) => {
  return (
    <div className="bg-[#1A1A22] p-6 rounded-xl border border-red-600/30 
                    hover:shadow-[0_0_20px_rgba(225,6,0,0.2)] 
                    transition duration-300">

      <div className="flex justify-between items-center">

        {/* Left */}
        <div>
          <p className="text-gray-400 text-sm">{race}</p>
          <h2 className="text-xl font-bold mt-1">{driver}</h2>
        </div>

        {/* Right */}
        <div className="text-right">
          <p className="text-2xl font-bold text-[#E10600]">
            {confidence}%
          </p>
          <p className="text-gray-400 text-sm">Confidence</p>
        </div>

      </div>

    </div>
  );
};

export default PredictionCard;