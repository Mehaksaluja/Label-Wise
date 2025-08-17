import { useState, useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HistoryPage from './pages/HistoryPage';
import HistoryDetailPage from './pages/HistoryDetailPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import Chatbot from './components/Chatbot';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    setIsLoggedIn(!!userInfo);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <><Navbar /><HomePage /></>} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <><Navbar /><LoginPage /></>} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" /> : <><Navbar /><RegisterPage /></>} />

        {/* This route is accessible to all, but will redirect inside if not logged in */}
        <Route path="/analyze" element={isLoggedIn ? <Layout><AnalysisPage /></Layout> : <><Navbar /><AnalysisPage /></>} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={isLoggedIn ? <Layout><DashboardPage /></Layout> : <Navigate to="/login" />} />
        <Route path="/history" element={isLoggedIn ? <Layout><HistoryPage /></Layout> : <Navigate to="/login" />} />
        <Route path="/history/:id" element={isLoggedIn ? <Layout><HistoryDetailPage /></Layout> : <Navigate to="/login" />} />
        <Route path="/onboarding" element={isLoggedIn ? <Layout><OnboardingPage /></Layout> : <Navigate to="/login" />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} />} />
      </Routes>
      {isLoggedIn && <Chatbot />}
    </>
  );
}

export default App;
