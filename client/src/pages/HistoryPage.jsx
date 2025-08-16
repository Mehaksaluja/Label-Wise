import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        setError('You must be logged in to view your history.');
        setIsLoading(false);
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get('http://localhost:5001/api/history', config);
        setHistory(data);
      } catch (err) {
        setError('Could not fetch analysis history.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (isLoading) {
    return <p className="text-center mt-8">Loading history...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-center mb-8">Your Analysis History</h1>
      {history.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>You haven't analyzed any products yet.</p>
          <Link to="/analyze" className="text-primary font-semibold hover:underline mt-2 inline-block">
            Analyze your first product
          </Link>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {history.map((item) => (
            <Link
              to={`/history/${item._id}`}
              key={item._id}
              className="block p-4 border border-secondary rounded-lg bg-white shadow-sm hover:border-primary transition-colors"
            >
              <p className="font-semibold truncate">Input: {item.userInput}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  Analyzed on: {new Date(item.timestamp).toLocaleDateString()}
                </p>
                <span className={`font-bold text-lg ${item.healthScore.startsWith('A') || item.healthScore.startsWith('B') ? 'text-green-500' : 'text-red-500'}`}>
                  Score: {item.healthScore}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;