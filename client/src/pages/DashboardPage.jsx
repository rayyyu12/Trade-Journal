// client/src/pages/DashboardPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTrades, getTradeStats } from '../store/actions/tradeActions';
import StatCard from '../components/dashboard/StatCard';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import RecentTrades from '../components/dashboard/RecentTrades';
import WinRateDisplay from '../components/dashboard/WinRateDisplay';
import Loading from '../components/common/Loading';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { trades, stats, loading } = useSelector(state => state.trades);
  
  useEffect(() => {
    dispatch(getTrades());
    dispatch(getTradeStats());
  }, [dispatch]);
  
  if (loading) {
    return <Loading />;
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary-900 mb-6">
        Welcome, {user?.name}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Trades"
          value={stats.totalTrades}
          icon="chart-bar"
          color="primary"
        />
        <StatCard
          title="Win Rate"
          value={`${stats.winRate.toFixed(2)}%`}
          icon="trophy"
          color={stats.winRate > 50 ? "success" : "danger"}
        />
        <StatCard
          title="Total P/L"
          value={`$${stats.totalProfitLoss.toFixed(2)}`}
          icon="currency-dollar"
          color={stats.totalProfitLoss > 0 ? "success" : "danger"}
        />
        <StatCard
          title="Avg. P/L per Trade"
          value={`$${stats.avgProfitLoss.toFixed(2)}`}
          icon="chart-pie"
          color={stats.avgProfitLoss > 0 ? "success" : "danger"}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="card h-full">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">
              Performance Over Time
            </h2>
            <PerformanceChart trades={trades} />
          </div>
        </div>
        
        <div>
          <div className="card h-full">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">
              Win Rate Analysis
            </h2>
            <WinRateDisplay trades={trades} />
          </div>
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">
          Recent Trades
        </h2>
        <RecentTrades trades={trades.slice(0, 5)} />
      </div>
    </div>
  );
};

export default DashboardPage;