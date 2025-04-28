// client/src/components/journal/TradeTable.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const TradeTable = ({ trades, showPagination = true, onTradeClick }) => {
  const getStatusClass = (status) => {
    if (status === 'OPEN') return 'bg-primary-100 text-primary-800';
    return 'bg-secondary-100 text-secondary-800';
  };

  const getDirectionClass = (direction) => {
    if (direction === 'LONG') return 'bg-success-100 text-success-800';
    return 'bg-danger-100 text-danger-800';
  };

  const getProfitLossClass = (profitLoss) => {
    if (profitLoss > 0) return 'text-success-600';
    if (profitLoss < 0) return 'text-danger-600';
    return 'text-secondary-600';
  };

  if (trades.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-secondary-500">No trades found. Add your first trade to get started.</p>
        <Link to="/journal/add" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Add Trade
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-secondary-200">
        <thead className="bg-secondary-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Symbol
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Direction
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
              P/L
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-secondary-200">
          {trades.map((trade) => (
            <tr 
              key={trade._id} 
              className="hover:bg-secondary-50 cursor-pointer"
              onClick={() => onTradeClick && onTradeClick(trade)}
            >
              <td className="px-4 py-3 whitespace-nowrap text-sm text-secondary-900">
                {format(new Date(trade.entryTime), 'MMM dd, yyyy')}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-secondary-900">
                {trade.symbol}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDirectionClass(trade.direction)}`}>
                  {trade.direction}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(trade.status)}`}>
                  {trade.status}
                </span>
              </td>
              <td className={`px-4 py-3 whitespace-nowrap text-sm text-right font-medium ${getProfitLossClass(trade.profitLoss)}`}>
                {trade.profitLoss > 0 && '+'}
                ${trade.profitLoss ? trade.profitLoss.toFixed(2) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {showPagination && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-secondary-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-secondary-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{trades.length}</span> of{' '}
                <span className="font-medium">{trades.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  className="relative inline-flex items-center px-4 py-2 border border-secondary-300 bg-white text-sm font-medium text-primary-600 hover:bg-secondary-50"
                >
                  1
                </button>
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeTable;