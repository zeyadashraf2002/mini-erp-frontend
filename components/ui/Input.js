import React from 'react';

const Input = ({ 
  label, 
  error, 
  className = '', 
  id,
  type = 'text',
  ...props 
}) => {
  const inputId = id || props.name || Math.random().toString(36).substr(2, 9);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-slate-300 shadow-sm
          ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 ml-1 text-xs font-medium text-red-500 tracking-wide">{error}</p>
      )}
    </div>
  );
};

export default Input;
