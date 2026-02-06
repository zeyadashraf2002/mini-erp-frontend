import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-sm transition-all duration-200 hover:shadow-md ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-8 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-xl font-bold leading-none tracking-tight text-slate-900 ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-slate-500 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`px-8 pb-8 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`flex items-center p-8 pt-0 border-t border-slate-50 mt-4 ${className}`} {...props}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
