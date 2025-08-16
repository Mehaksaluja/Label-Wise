const StatCard = ({ label, value, unit }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-secondary text-center">
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-gray-500 text-xs">{unit}</p>
    </div>
  );
};

export default StatCard;