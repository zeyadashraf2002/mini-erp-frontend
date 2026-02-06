import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false, 
  disabled = false, 
  ...props 
}) => {
  const baseStyles = 'btn-base transition-smooth focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-sky-500 text-white hover:bg-sky-600 shadow-soft hover:shadow-soft-lg focus:ring-sky-100',
    secondary: 'bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-soft focus:ring-gray-100',
    outline: 'border-2 border-gray-200 bg-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-100',
    ghost: 'hover:bg-gray-100 text-gray-700 hover:text-gray-900',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-soft hover:shadow-soft-lg focus:ring-red-100',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-soft hover:shadow-soft-lg focus:ring-emerald-100',
    link: 'text-sky-600 hover:text-sky-700 hover:underline underline-offset-4 p-0 h-auto font-medium'
  };

  const sizes = {
    sm: 'h-9 px-4 text-xs',
    md: 'h-11 px-6 text-sm',
    lg: 'h-13 px-8 text-base',
    xl: 'h-14 px-10 text-lg',
    icon: 'h-11 w-11 p-0'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg 
          className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-current" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
