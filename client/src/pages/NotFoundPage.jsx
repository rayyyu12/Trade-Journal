import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-secondary-100 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-3xl font-semibold text-secondary-900 mt-4">Page Not Found</h2>
        <p className="mt-2 text-secondary-600">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link 
            to="/" 
            className="btn btn-primary"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;