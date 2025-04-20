import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-700">TradeZella Clone</h1>
          <div>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-secondary-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Track, Analyze & Improve Your Trades
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-xl text-secondary-500">
              Your complete trading journal solution to help you become a better trader through data-driven insights.
            </p>
            
            {!isAuthenticated && (
              <div className="mt-8">
                <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
                  Get Started for Free
                </Link>
              </div>
            )}
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="card text-center">
                <div className="text-primary-700 text-5xl mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900">Journal Your Trades</h3>
                <p className="mt-2 text-secondary-600">
                  Record and track every trade with detailed information to build consistency.
                </p>
              </div>
              
              <div className="card text-center">
                <div className="text-primary-700 text-5xl mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900">Analyze Performance</h3>
                <p className="mt-2 text-secondary-600">
                  Gain insights into your trading patterns, strengths, and weaknesses.
                </p>
              </div>
              
              <div className="card text-center">
                <div className="text-primary-700 text-5xl mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900">Identify Mistakes</h3>
                <p className="mt-2 text-secondary-600">
                  Learn from your trading history and avoid repeating the same mistakes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-secondary-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center">
            &copy; {new Date().getFullYear()} TradeZella Clone. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;