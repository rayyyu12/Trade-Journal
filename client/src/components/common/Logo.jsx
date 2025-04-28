// client/src/components/common/Logo.jsx
import React from 'react';

const Logo = ({ size = 'medium', className = '', textColor = 'text-white' }) => {
  let dimensions;
  
  switch (size) {
    case 'small':
      dimensions = 'h-6 w-6';
      break;
    case 'large':
      dimensions = 'h-12 w-12';
      break;
    case 'medium':
    default:
      dimensions = 'h-8 w-8';
      break;
  }
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${dimensions} relative`}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Quantum-inspired logo with wave pattern */}
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" className="text-primary-600" fill="currentColor" opacity="0.2"/>
          
          {/* Sine wave pattern */}
          <path d="M4 12C4 12 5.5 9 8 9C10.5 9 10.5 15 13 15C15.5 15 17 12 17 12" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary-500"/>
          
          {/* Upward trend arrow */}
          <path d="M17 7L20 10M20 10L17 13M20 10H11" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"/>
          
          {/* Data points */}
          <circle cx="8" cy="9" r="1.5" className="text-primary-600" fill="currentColor"/>
          <circle cx="13" cy="15" r="1.5" className="text-primary-600" fill="currentColor"/>
          <circle cx="17" cy="12" r="1.5" className="text-primary-600" fill="currentColor"/>
        </svg>
      </div>
      <span className={`ml-2 font-display font-bold text-xl tracking-tight ${textColor}`}>
        Quanta Trades
      </span>
    </div>
  );
};

export default Logo;