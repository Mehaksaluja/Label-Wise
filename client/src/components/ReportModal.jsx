import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const ReportModal = ({ isOpen, onClose }) => {
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateReport = async () => {
      if (!isOpen) return; // Don't fetch if the modal isn't open

      setIsLoading(true);
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.post('http://localhost:5001/api/reports/generate', { period: 'weekly' }, config);
        setReport(data.report);
      } catch (error) {
        setReport('Sorry, there was an error generating your report.');
      } finally {
        setIsLoading(false);
      }
    };

    generateReport();
  }, [isOpen]); // Re-run this effect every time the modal is opened

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl m-4 flex flex-col h-5/6">
        <h2 className="text-3xl font-bold mb-4 text-center">Your Weekly Report</h2>
        <div className="prose lg:prose-xl flex-1 overflow-y-auto pr-2">
          {isLoading ? (
            <p className="text-center">Generating your report...</p>
          ) : (
            <ReactMarkdown>{report}</ReactMarkdown>
          )}
        </div>
        <button onClick={onClose} className="mt-6 w-full bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90">
          Close
        </button>
      </div>
    </div>
  );
};

export default ReportModal;