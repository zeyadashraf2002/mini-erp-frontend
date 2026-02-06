import React from 'react';

const Table = ({ children, className = '', ...props }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-soft">
      <table className={`w-full border-collapse ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ children, className = '', ...props }) => {
  return (
    <thead className={`bg-gray-50 border-b border-gray-100 ${className}`} {...props}>
      {children}
    </thead>
  );
};

const TableBody = ({ children, className = '', ...props }) => {
  return (
    <tbody className={`divide-y divide-gray-100 ${className}`} {...props}>
      {children}
    </tbody>
  );
};

const TableFooter = ({ children, className = '', ...props }) => {
  return (
    <tfoot className={`bg-gray-50 border-t border-gray-200 ${className}`} {...props}>
      {children}
    </tfoot>
  );
};

const TableRow = ({ children, className = '', hover = true, ...props }) => {
  const hoverClass = hover ? 'hover:bg-gray-50 transition-smooth' : '';
  return (
    <tr className={`${hoverClass} ${className}`} {...props}>
      {children}
    </tr>
  );
};

const TableHead = ({ children, className = '', ...props }) => {
  return (
    <th 
      className={`px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${className}`} 
      {...props}
    >
      {children}
    </th>
  );
};

const TableCell = ({ children, className = '', ...props }) => {
  return (
    <td 
      className={`px-6 py-4 text-sm text-gray-900 ${className}`} 
      {...props}
    >
      {children}
    </td>
  );
};

// Attach sub-components to Table
Table.Header = TableHeader;
Table.Body = TableBody;
Table.Footer = TableFooter;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;

// Export both default and named exports
export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell };
export default Table;
