// client/src/components/common/Card.jsx
import React from 'react';

const Card = ({ children, title, className = '', footer, noPadding = false, color = 'default' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'border-l-4 border-primary-500';
      case 'success':
        return 'border-l-4 border-success-500';
      case 'danger':
        return 'border-l-4 border-danger-500';
      case 'warning':
        return 'border-l-4 border-warning-500';
      case 'info':
        return 'border-l-4 border-info-500';
      default:
        return '';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-300 ${getColorClasses()} ${noPadding ? '' : 'p-6'} ${className}`}>
      {title && (
        <div className="mb-4 pb-3 border-b border-secondary-200">
          <h3 className="text-lg font-medium text-secondary-900">{title}</h3>
        </div>
      )}
      
      <div className={noPadding ? '' : 'mb-4'}>
        {children}
      </div>
      
      {footer && (
        <div className={`${noPadding ? 'p-4' : ''} mt-4 pt-4 border-t border-secondary-200`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;