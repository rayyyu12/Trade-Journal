// client/src/components/dashboard/WinRateChart.jsx
import React from 'react';

const WinRateChart = ({ winRate, wins, losses }) => {
  const totalTrades = wins + losses;
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-primary-600">
          {winRate}%
        </div>
        <div className="text-sm text-secondary-500 mt-1">
          Win Rate
        </div>
      </div>
      
      <div className="w-full bg-secondary-100 rounded-full h-4 mb-6">
        <div 
          className="bg-primary-600 h-4 rounded-full" 
          style={{ width: `${winRate}%` }}
        ></div>
      </div>
      
      <div className="grid grid-cols-3 w-full text-center">
        <div className="col-span-1">
          <div className="text-2xl font-bold">{totalTrades}</div>
          <div className="text-xs text-secondary-500">Total</div>
        </div>
        <div className="col-span-1">
          <div className="text-2xl font-bold text-success-600">{wins}</div>
          <div className="text-xs text-secondary-500">Wins</div>
        </div>
        <div className="col-span-1">
          <div className="text-2xl font-bold text-danger-600">{losses}</div>
          <div className="text-xs text-secondary-500">Losses</div>
        </div>
      </div>
    </div>
  );
};

export default WinRateChart;