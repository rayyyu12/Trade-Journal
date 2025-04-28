// client/src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import StatCard from '../components/dashboard/StatCard';
import TradeTable from '../components/journal/TradeTable';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import WinRateChart from '../components/dashboard/WinRateChart';

const DashboardPage = () => {
  const { user } = useSelector(state => state.auth || {});
  // Instead of trying to get trades from state, use sample data initially
  // You can connect this to Redux when the store is properly set up
  const [trades, setTrades] = useState([
    {
      _id: '1',
      symbol: 'NQ',
      direction: 'LONG',
      status: 'CLOSED',
      entryTime: new Date('2025-04-26T10:00:00'),
      exitTime: new Date('2025-04-26T14:30:00'),
      entryPrice: 18500,
      exitPrice: 18600,
      quantity: 1,
      profitLoss: 2000,
      fees: 0,
      pointValue: 20
    },
    {
      _id: '2',
      symbol: 'NQ',
      direction: 'LONG',
      status: 'CLOSED',
      entryTime: new Date('2025-04-26T15:00:00'),
      exitTime: new Date('2025-04-26T16:30:00'),
      entryPrice: 18550,
      exitPrice: 18600,
      quantity: 1,
      profitLoss: 1000,
      fees: 0,
      pointValue: 20
    }
  ]);
  
  // Calculate stats from the sample data
  const totalTrades = trades.length;
  
  const closedTrades = trades.filter(trade => trade.status === 'CLOSED');
  const winningTrades = closedTrades.filter(trade => trade.profitLoss > 0);
  const winRate = closedTrades.length > 0
    ? ((winningTrades.length / closedTrades.length) * 100).toFixed(2)
    : 0;
  
  const totalPL = closedTrades.reduce((sum, trade) => sum + (trade.profitLoss || 0), 0);
  
  const avgPL = closedTrades.length > 0
    ? totalPL / closedTrades.length
    : 0;
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Welcome, {user?.name || 'Trader'}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Trades"
          value={totalTrades}
          icon="chart-bar"
          color="primary"
        />
        <StatCard
          title="Win Rate"
          value={`${winRate}%`}
          icon="trophy"
          color="success"
        />
        <StatCard
          title="Total P/L"
          value={`$${totalPL.toFixed(2)}`}
          icon="currency-dollar"
          color={totalPL >= 0 ? 'success' : 'danger'}
        />
        <StatCard
          title="Avg. P/L per Trade"
          value={`$${avgPL.toFixed(2)}`}
          icon="chart-pie"
          color={avgPL >= 0 ? 'success' : 'danger'}
        />
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-medium mb-4">Performance Over Time</h2>
            <PerformanceChart trades={trades} />
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-4 h-full">
            <h2 className="text-lg font-medium mb-4">Win Rate Analysis</h2>
            <WinRateChart winRate={winRate} wins={winningTrades.length} losses={closedTrades.length - winningTrades.length} />
          </div>
        </div>
      </div>
      
      <div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-medium mb-4">Recent Trades</h2>
          <TradeTable 
            trades={trades.slice(0, 5)} 
            showPagination={false}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;