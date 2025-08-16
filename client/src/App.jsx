import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage'; // Import RegisterPage
import LoginPage from './pages/LoginPage';     // Import LoginPage

function App() {
  return (
    <div>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyze" element={<AnalysisPage />} />
          <Route path="/register" element={<RegisterPage />} /> {/* Add Register Route */}
          <Route path="/login" element={<LoginPage />} />       {/* Add Login Route */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
