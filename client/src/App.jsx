import { Box } from '@chakra-ui/react'; // This import is no longer needed
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import Navbar from './components/Navbar'; // 1. Import the Navbar

function App() {
  return (
    // Use a standard div or React Fragment
    <div>
      {/* 2. Place the Navbar here so it's on every page */}
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyze" element={<AnalysisPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;