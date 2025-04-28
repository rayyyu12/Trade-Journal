// client/src/App.js (with navbar removed)
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './store/actions/authActions';

// Components
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import Loading from './components/common/Loading';

// Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import JournalPage from './pages/JournalPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Placeholder page for routes not yet implemented
const PlaceholderPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="p-8 bg-white rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold text-primary-600 mb-4">{title} Feature</h2>
      <p className="text-secondary-600 mb-6">This feature is coming soon in a future update.</p>
      <div className="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
    </div>
  </div>
);

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  
  if (loading) return <Loading />;
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="content-container">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

const App = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      } />
      
      <Route path="/journal" element={
        <PrivateRoute>
          <JournalPage />
        </PrivateRoute>
      } />
      
      <Route path="/analytics" element={
        <PrivateRoute>
          <PlaceholderPage title="Analytics" />
        </PrivateRoute>
      } />
      
      <Route path="/replay" element={
        <PrivateRoute>
          <PlaceholderPage title="Trade Replay" />
        </PrivateRoute>
      } />
      
      <Route path="/playbook" element={
        <PrivateRoute>
          <PlaceholderPage title="Playbook" />
        </PrivateRoute>
      } />
      
      <Route path="/backtesting" element={
        <PrivateRoute>
          <PlaceholderPage title="Backtesting" />
        </PrivateRoute>
      } />
      
      <Route path="/settings" element={
        <PrivateRoute>
          <PlaceholderPage title="Settings" />
        </PrivateRoute>
      } />
      
      <Route path="/profile" element={
        <PrivateRoute>
          <PlaceholderPage title="Profile" />
        </PrivateRoute>
      } />
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;