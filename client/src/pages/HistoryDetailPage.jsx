import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ResultsDisplay from '../components/ResultsDisplay';

const HistoryDetailPage = () => {
  const { id } = useParams(); // Gets the ':id' from the URL
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        setError('You must be logged in to view this page.');
        setIsLoading(false);
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get(`http://localhost:5001/api/history/${id}`, config);
        setAnalysis(data);
      } catch (err) {
        setError('Could not fetch the analysis report.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  if (isLoading) return <p className="text-center mt-8">Loading analysis...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link to="/history" className="text-primary font-semibold hover:underline mb-6 inline-block">
          &larr; Back to History
        </Link>
        {/* We reuse the same component from the analysis page! */}
        <ResultsDisplay data={analysis} />
      </div>
    </div>
  );
};

export default HistoryDetailPage;