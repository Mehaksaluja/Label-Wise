import { useState } from 'react';
import axios from 'axios';
import ResultsDisplay from '../components/ResultsDisplay'; // Make sure this path is correct

const AnalysisPage = () => {
  // State to hold the user's input
  const [ingredients, setIngredients] = useState('');
  // State to hold the analysis result from the API
  const [result, setResult] = useState(null);
  // State to manage the loading status
  const [isLoading, setIsLoading] = useState(false);
  // State to hold any errors
  const [error, setError] = useState(null);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Make a POST request to our backend API
      const response = await axios.post('http://localhost:5001/api/analyze', {
        userInput: ingredients,
      });
      setResult(response.data); // Set the result state with the API response
    } catch (err) {
      setError('An error occurred. Please check the ingredients and try again.');
      console.error(err);
    } finally {
      setIsLoading(false); // Set loading to false after the request is complete
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Page Title and Description */}
        <h1 className="text-4xl font-extrabold text-center">Analyze Your Ingredients</h1>
        <p className="mt-4 text-center text-gray-600">
          Paste the ingredient list from any food or cosmetic product below to get an instant health analysis.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-8">
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g., Whole Grain Oats, Sugar, Canola and/or Sunflower Oil, Rice Flour, Honey, Salt..."
            className="w-full h-48 p-4 border border-secondary rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full bg-primary text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Now'}
          </button>
        </form>

        {/* Results Section */}
        <div className="mt-12">
          {error && <p className="text-center text-red-500">{error}</p>}

          {/* Use the ResultsDisplay component to show the formatted report */}
          <ResultsDisplay data={result} />
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
