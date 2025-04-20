import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PerformanceChart = ({ trades }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    if (!trades || trades.length === 0) {
      return;
    }

    // Sort trades by entry time
    const sortedTrades = [...trades]
      .filter(trade => trade.status === 'CLOSED')
      .sort((a, b) => new Date(a.entryTime) - new Date(b.entryTime));

    // Process data for chart
    const dates = [];
    const cumulativePL = [];
    let runningTotal = 0;

    sortedTrades.forEach((trade) => {
      const date = new Date(trade.entryTime).toLocaleDateString();
      dates.push(date);
      runningTotal += trade.profitLoss || 0;
      cumulativePL.push(runningTotal);
    });

    setChartData({
      labels: dates,
      datasets: [
        {
          label: 'Cumulative P/L',
          data: cumulativePL,
          fill: false,
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          borderColor: 'rgba(99, 102, 241, 1)',
          tension: 0.1
        }
      ]
    });
  }, [trades]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `P/L: $${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        }
      }
    }
  };

  if (!trades || trades.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-secondary-50 rounded-lg">
        <p className="text-secondary-500">No trade data available</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PerformanceChart;