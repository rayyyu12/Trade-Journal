import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-secondary-200 py-4">
      <div className="px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-secondary-500">
          &copy; {new Date().getFullYear()} TradeZella Clone. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;