import { useState } from 'react';
import axios from 'axios';

const WeightLogModal = ({ isOpen, onClose, onLogSuccess }) => {
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('kg');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('http://localhost:5001/api/progress/weight', { weight, unit }, config);
      onLogSuccess(); // Refresh dashboard data
      onClose(); // Close the modal
    } catch (err) {
      setError('Failed to log weight. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-4">Log Your Weight</h2>
        {error && <p className="text-red-500 bg-red-100 p-2 rounded-md mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g., 75.5"
              className="w-full p-3 border border-secondary rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              required
              step="0.1"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="p-3 border border-secondary rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="font-semibold text-gray-600">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WeightLogModal;