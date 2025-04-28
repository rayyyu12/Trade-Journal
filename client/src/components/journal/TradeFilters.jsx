// client/src/components/journal/TradeFilters.jsx (Updated)
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import Card from '../common/Card';
import Button from '../common/Button';
import 'react-datepicker/dist/react-datepicker.css';

const TradeFilters = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [expanded, setExpanded] = useState(false);
  
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...localFilters, [name]: value };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  const handleDateChange = (date, field) => {
    const updatedFilters = { ...localFilters, [field]: date };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  const clearFilters = () => {
    const clearedFilters = {
      symbol: '',
      direction: '',
      status: '',
      startDate: null,
      endDate: null,
      strategy: '',
      setupType: '',
      timeframe: '',
      emotions: ''
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const isAnyFilterApplied = () => {
    return Object.entries(localFilters).some(([key, value]) => {
      if (key === 'startDate' || key === 'endDate') {
        return value !== null;
      }
      return value !== '';
    });
  };
  
  return (
    <Card>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium text-secondary-900">Filter Trades</h3>
        {isAnyFilterApplied() && (
          <Button 
            variant="outline" 
            size="small" 
            onClick={clearFilters}
          >
            Clear All Filters
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="symbol" className="form-label">Symbol</label>
          <input
            type="text"
            id="symbol"
            name="symbol"
            className="form-input"
            placeholder="e.g. AAPL"
            value={localFilters.symbol}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="direction" className="form-label">Direction</label>
          <select
            id="direction"
            name="direction"
            className="form-input"
            value={localFilters.direction}
            onChange={handleChange}
          >
            <option value="">All</option>
            <option value="LONG">Long</option>
            <option value="SHORT">Short</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="status" className="form-label">Status</label>
          <select
            id="status"
            name="status"
            className="form-input"
            value={localFilters.status}
            onChange={handleChange}
          >
            <option value="">All</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="form-label">Start Date</label>
          <DatePicker
            selected={localFilters.startDate}
            onChange={(date) => handleDateChange(date, 'startDate')}
            className="form-input w-full"
            placeholderText="From"
            dateFormat="MM/dd/yyyy"
            isClearable
          />
        </div>
        
        <div>
          <label className="form-label">End Date</label>
          <DatePicker
            selected={localFilters.endDate}
            onChange={(date) => handleDateChange(date, 'endDate')}
            className="form-input w-full"
            placeholderText="To"
            dateFormat="MM/dd/yyyy"
            isClearable
            minDate={localFilters.startDate}
          />
        </div>
      </div>
      
      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-secondary-200">
          <div>
            <label htmlFor="strategy" className="form-label">Strategy</label>
            <input
              type="text"
              id="strategy"
              name="strategy"
              className="form-input"
              placeholder="e.g. Breakout"
              value={localFilters.strategy}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="setupType" className="form-label">Setup Type</label>
            <input
              type="text"
              id="setupType"
              name="setupType"
              className="form-input"
              placeholder="e.g. Gap and Go"
              value={localFilters.setupType}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="timeframe" className="form-label">Timeframe</label>
            <select
              id="timeframe"
              name="timeframe"
              className="form-input"
              value={localFilters.timeframe}
              onChange={handleChange}
            >
              <option value="">All</option>
              <option value="1min">1 Minute</option>
              <option value="5min">5 Minutes</option>
              <option value="15min">15 Minutes</option>
              <option value="30min">30 Minutes</option>
              <option value="1hour">1 Hour</option>
              <option value="4hour">4 Hours</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="emotions" className="form-label">Emotional State</label>
            <select
              id="emotions"
              name="emotions"
              className="form-input"
              value={localFilters.emotions}
              onChange={handleChange}
            >
              <option value="">All</option>
              <option value="CONFIDENT">Confident</option>
              <option value="NERVOUS">Nervous</option>
              <option value="GREEDY">Greedy</option>
              <option value="FEARFUL">Fearful</option>
              <option value="CALM">Calm</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>
      )}
      
      <div className="mt-4 flex justify-center">
        <Button
          variant="secondary"
          size="small"
          onClick={toggleExpanded}
        >
          {expanded ? 'Show Less Filters' : 'Show More Filters'}
        </Button>
      </div>
    </Card>
  );
};

export default TradeFilters;