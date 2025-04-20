import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TradeFilters = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  
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
      endDate: null
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };
  
  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-secondary-900 mb-2">Filter Trades</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
      
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={clearFilters}
          className="btn btn-secondary"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default TradeFilters;