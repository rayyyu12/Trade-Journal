import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const RecentTrades = ({ trades }) => {
  if (!trades || trades.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-secondary-500">No recent trades to display</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-secondary-200">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Symbol
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Direction
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
              P/L
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-secondary-200">
          {trades.map(trade => (
            <tr key={trade._id} className="hover:bg-secondary-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm text-secondary-500">
                {format(new Date(trade.entryTime), 'MMM dd, yyyy')}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm font-medium text-secondary-900">
                  {trade.symbol}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  trade.direction === 'LONG'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {trade.direction}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  trade.status === 'OPEN'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-secondary-100 text-secondary-800'
                }`}>
                  {trade.status}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                {trade.profitLoss !== undefined && trade.status === 'CLOSED' ? (
                  <span className={`font-medium ${
                    trade.profitLoss > 0 
                      ? 'text-success-600' 
                      : trade.profitLoss < 0 
                        ? 'text-danger-600' 
                        : 'text-secondary-500'
                  }`}>
                    ${trade.profitLoss.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-secondary-400">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-4 text-right">
        <Link 
          to="/journal" 
          className="text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          View all trades →
        </Link>
      </div>
    </div>
  );
};

export default RecentTrades;