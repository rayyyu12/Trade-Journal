import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false, 
  disabled = false, 
  onClick, 
  className = '' 
}) => {
  const baseClass = 'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out rounded-md';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-200 text-secondary-800 hover:bg-secondary-300 focus:ring-secondary-400',
    success: 'bg-success-500 text-white hover:bg-success-600 focus:ring-success-500',
    danger: 'bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500',
    outline: 'bg-white border border-secondary-300 text-secondary-700 hover:bg-secondary-50 focus:ring-secondary-400'
  };
  
  const sizeClasses = {
    small: 'px-2.5 py-1.5 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };
  
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      className={`${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClass} ${widthClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;