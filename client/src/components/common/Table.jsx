// client/src/components/common/Table.jsx
import React from 'react';

const Table = ({ 
  columns, 
  data, 
  onRowClick, 
  isLoading = false,
  emptyMessage = 'No data available',
  className = ''
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-2 text-secondary-600">Loading data...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-secondary-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-secondary-200">
        <thead className="bg-secondary-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider ${column.className || ''}`}
                style={column.width ? { width: column.width } : {}}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-secondary-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${onRowClick ? 'cursor-pointer hover:bg-secondary-50' : ''}`}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column, colIndex) => (
                <td 
                  key={colIndex}
                  className={`px-6 py-4 whitespace-nowrap ${column.cellClassName || ''}`}
                >
                  {column.cell ? column.cell(row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;