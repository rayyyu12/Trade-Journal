import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './store/actions/authActions';

// Components
import Navbar from './components/common/Navbar';
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

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  
  if (loading) return <Loading />;
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
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
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;