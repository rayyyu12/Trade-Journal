// client/src/components/dashboard/PerformanceChart.jsx
import React, { useEffect, useState } from 'react';

const PerformanceChart = ({ trades }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Process trades to generate cumulative P/L data
    if (trades.length === 0) return;

    const sortedTrades = [...trades]
      .filter(trade => trade.status === 'CLOSED' && trade.exitTime)
      .sort((a, b) => new Date(a.exitTime) - new Date(b.exitTime));
    
    let cumulativePL = 0;
    const data = sortedTrades.map(trade => {
      cumulativePL += (trade.profitLoss || 0);
      return {
        date: new Date(trade.exitTime).toLocaleDateString(),
        value: cumulativePL
      };
    });

    // Add initial point if we have data
    if (data.length > 0) {
      data.unshift({
        date: new Date(sortedTrades[0].entryTime).toLocaleDateString(),
        value: 0
      });
    }

    setChartData(data);
  }, [trades]);

  if (chartData.length <= 1) {
    return (
      <div className="flex items-center justify-center h-60 bg-secondary-50 rounded-lg">
        <p className="text-secondary-500">Not enough data to generate chart</p>
      </div>
    );
  }

  // Calculate chart dimensions
  const width = 1000;
  const height = 300;
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  // Calculate scales
  const values = chartData.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue;
  
  // Create SVG path for the line
  const points = chartData.map((d, i) => {
    const x = padding + (i / (chartData.length - 1)) * chartWidth;
    const normalizedValue = (d.value - minValue) / (valueRange || 1);
    const y = height - padding - normalizedValue * chartHeight;
    return `${x},${y}`;
  });
  
  const linePath = `M ${points.join(' L ')}`;
  
  return (
    <div className="relative h-60 w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full">
        {/* Y-axis grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
          const y = padding + tick * chartHeight;
          const value = maxValue - tick * valueRange;
          return (
            <g key={i}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text
                x={padding - 5}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="12"
                fill="#6b7280"
              >
                ${value.toFixed(0)}
              </text>
            </g>
          );
        })}
        
        {/* X-axis grid lines and labels */}
        {chartData.map((d, i) => {
          // Only show a few labels to avoid overcrowding
          if (chartData.length > 5 && i !== 0 && i !== chartData.length - 1 && i % Math.ceil(chartData.length / 5) !== 0) {
            return null;
          }
          
          const x = padding + (i / (chartData.length - 1)) * chartWidth;
          return (
            <g key={i}>
              <line
                x1={x}
                y1={padding}
                x2={x}
                y2={height - padding}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text
                x={x}
                y={height - padding + 15}
                textAnchor="middle"
                fontSize="12"
                fill="#6b7280"
              >
                {d.date}
              </text>
            </g>
          );
        })}
        
        {/* The line representing cumulative P/L */}
        <path
          d={linePath}
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
        />
        
        {/* Circles at each data point */}
        {chartData.map((d, i) => {
          const x = padding + (i / (chartData.length - 1)) * chartWidth;
          const normalizedValue = (d.value - minValue) / (valueRange || 1);
          const y = height - padding - normalizedValue * chartHeight;
          
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="#10b981"
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default PerformanceChart;