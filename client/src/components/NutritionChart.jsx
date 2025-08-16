import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const NutritionChart = ({ data }) => {
  const chartData = [
    { name: 'Protein', value: data.totalProtein },
    { name: 'Carbs', value: data.totalCarbs },
    { name: 'Fat', value: data.totalFat },
  ];

  const COLORS = ['#38A169', '#4299E1', '#ED8936']; // Green for Protein, Blue for Carbs, Orange for Fat

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-secondary h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NutritionChart;