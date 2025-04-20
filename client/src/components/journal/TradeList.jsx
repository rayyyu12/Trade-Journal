import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteTrade } from '../../store/actions/tradeActions';
import { format } from 'date-fns';

const TradeList = ({ trades, loading }) => {
  const dispatch = useDispatch();
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      dispatch(deleteTrade(id));
    }
  };
  
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-2 text-secondary-600">Loading trades...</p>
      </div>
    );
  }
  
  if (!trades || trades.length === 0) {
    return (
      <div className="text-center py-8 card">
        <p className="text-secondary-600">No trades found. Add your first trade to get started!</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto card">
      <table className="min-w-full divide-y divide-secondary-200">
        <thead className="bg-secondary-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Symbol
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Direction
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Entry Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Exit Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Entry Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              P/L
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-secondary-200">
          {trades.map((trade) => (
            <tr key={trade._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-secondary-900">
                  {trade.symbol}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  trade.direction === 'LONG'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {trade.direction}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                ${trade.entryPrice.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                {trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                {format(new Date(trade.entryTime), 'MMM dd, yyyy HH:mm')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  trade.status === 'OPEN'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-secondary-100 text-secondary-800'
                }`}>
                  {trade.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {trade.profitLoss ? (
                  <span className={trade.profitLoss > 0 ? 'text-success-600' : 'text-danger-600'}>
                    ${trade.profitLoss.toFixed(2)}
                  </span>
                ) : (
                  '-'
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleDelete(trade._id)}
                  className="text-danger-600 hover:text-danger-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradeList;