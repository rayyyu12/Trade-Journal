import React, { useEffect, useState } from 'react';

const WinRateDisplay = ({ trades }) => {
  const [winRate, setWinRate] = useState(0);
  const [totalTrades, setTotalTrades] = useState(0);
  const [winningTrades, setWinningTrades] = useState(0);
  const [losingTrades, setLosingTrades] = useState(0);

  useEffect(() => {
    if (!trades || trades.length === 0) {
      return;
    }

    const closedTrades = trades.filter(trade => trade.status === 'CLOSED');
    const winning = closedTrades.filter(trade => trade.isWin).length;
    const losing = closedTrades.length - winning;
    
    setTotalTrades(closedTrades.length);
    setWinningTrades(winning);
    setLosingTrades(losing);
    setWinRate(closedTrades.length > 0 ? (winning / closedTrades.length) * 100 : 0);
  }, [trades]);

  // Get color based on win rate
  const getColor = () => {
    if (winRate >= 60) return 'bg-success-500';
    if (winRate >= 50) return 'bg-success-400';
    if (winRate >= 40) return 'bg-yellow-500';
    return 'bg-danger-500';
  };

  if (!trades || trades.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-secondary-50 rounded-lg">
        <p className="text-secondary-500">No trade data available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-4">
        <div className="text-3xl font-bold">{winRate.toFixed(1)}%</div>
        <div className="text-sm text-secondary-500">Win Rate</div>
      </div>

      <div className="flex-1 flex items-center">
        <div className="w-full bg-secondary-200 rounded-full h-4 overflow-hidden">
          <div 
            className={`h-full ${getColor()}`} 
            style={{ width: `${winRate}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        <div className="p-2 bg-secondary-100 rounded">
          <div className="text-lg font-semibold">{totalTrades}</div>
          <div className="text-xs text-secondary-500">Total</div>
        </div>
        <div className="p-2 bg-success-100 rounded">
          <div className="text-lg font-semibold text-success-600">{winningTrades}</div>
          <div className="text-xs text-secondary-500">Wins</div>
        </div>
        <div className="p-2 bg-danger-100 rounded">
          <div className="text-lg font-semibold text-danger-600">{losingTrades}</div>
          <div className="text-xs text-secondary-500">Losses</div>
        </div>
      </div>
    </div>
  );
};

export default WinRateDisplay;