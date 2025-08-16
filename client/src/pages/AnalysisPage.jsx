import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import axios from 'axios';
import ResultsDisplay from '../components/ResultsDisplay';

const AnalysisPage = () => {
  const [ingredients, setIngredients] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // 2. Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 3. Get user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // 4. If user is not logged in, redirect them
    if (!userInfo) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // 5. Create a config object with the user's token
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // 6. Send the request with the input AND the config object
      const response = await axios.post(
        'http://localhost:5001/api/analyze',
        { userInput: ingredients },
        config
      );

      setResult(response.data);
    } catch (err) {
      setError('An error occurred. Please ensure you are logged in and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* ... The rest of the JSX (form and results display) remains the same ... */}
        <h1 className="text-4xl font-extrabold text-center">Analyze Your Ingredients</h1>
        <p className="mt-4 text-center text-gray-600">
          Paste the ingredient list from any food or cosmetic product below to get an instant health analysis.
        </p>
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
        <div className="mt-12">
          {error && <p className="text-center text-red-500">{error}</p>}
          <ResultsDisplay data={result} />
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;