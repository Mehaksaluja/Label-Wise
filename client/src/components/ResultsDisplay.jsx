import React from 'react';

// Helper function to determine the color of the score
const getScoreColor = (score) => {
  if (['A+', 'A', 'B'].includes(score)) return 'text-green-500';
  if (['C', 'D'].includes(score)) return 'text-yellow-500';
  if (['F'].includes(score) || score.startsWith('N/A')) return 'text-red-500';
  return 'text-gray-800';
};

const ResultsDisplay = ({ data }) => {
  if (!data) return null;

  return (
    // Main container for the report
    <div className="p-6 border border-secondary rounded-lg bg-white shadow-lg animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-6">Analysis Report</h2>

      {/* Health Score Section */}
      <div className="text-center mb-8">
        <p className="text-lg text-gray-600 mb-2">Overall Health Score</p>
        <p className={`text-7xl font-extrabold ${getScoreColor(data.healthScore)}`}>
          {data.healthScore}
        </p>
      </div>

      {/* Summary Section */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Summary</h3>
        <p className="text-gray-700">{data.summary}</p>
      </div>

      {/* Nutritional Info Grid */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Estimated Nutritional Info</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 p-3 rounded-lg"><p className="font-bold text-blue-800">{data.nutritionalInfo.calories || 'N/A'}</p><p className="text-sm text-blue-600">Calories</p></div>
          <div className="bg-green-50 p-3 rounded-lg"><p className="font-bold text-green-800">{data.nutritionalInfo.protein || 'N/A'}</p><p className="text-sm text-green-600">Protein</p></div>
          <div className="bg-orange-50 p-3 rounded-lg"><p className="font-bold text-orange-800">{data.nutritionalInfo.carbs || 'N/A'}</p><p className="text-sm text-orange-600">Carbs</p></div>
          <div className="bg-purple-50 p-3 rounded-lg"><p className="font-bold text-purple-800">{data.nutritionalInfo.fat || 'N/A'}</p><p className="text-sm text-purple-600">Fat</p></div>
        </div>
      </div>

      {/* Ingredient Breakdown */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-3 text-green-600">Beneficial Ingredients ✅</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {data.beneficialIngredients.length > 0 ? data.beneficialIngredients.map((item, i) => <li key={i}>{item}</li>) : <li>None identified.</li>}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3 text-red-600">Ingredients to Watch 🚩</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {data.ingredientsToWatch.length > 0 ? data.ingredientsToWatch.map((item, i) => <li key={i}>{item}</li>) : <li>None identified.</li>}
          </ul>
        </div>
      </div>

      {/* Allergen Alerts */}
      {data.allergenAlerts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <h3 className="text-xl font-semibold text-red-800">⚠️ Potential Allergen Alerts</h3>
          <ul className="list-disc list-inside space-y-2 mt-2 text-red-700">
            {data.allergenAlerts.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;