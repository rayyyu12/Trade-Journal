// client/src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-secondary-200 py-4">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <p className="text-sm text-secondary-500">
            &copy; {new Date().getFullYear()} Quanta Trades. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link to="/privacy" className="text-secondary-400 hover:text-secondary-500">
              <span className="sr-only">Privacy Policy</span>
              Privacy
            </Link>
            <Link to="/terms" className="text-secondary-400 hover:text-secondary-500">
              <span className="sr-only">Terms of Service</span>
              Terms
            </Link>
            <Link to="/support" className="text-secondary-400 hover:text-secondary-500">
              <span className="sr-only">Support</span>
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;