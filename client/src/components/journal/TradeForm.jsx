import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTrade } from '../../store/actions/tradeActions';

const TradeForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    symbol: '',
    direction: 'LONG',
    entryPrice: '',
    exitPrice: '',
    quantity: '',
    entryTime: '',
    exitTime: '',
    status: 'OPEN',
    stopLoss: '',
    takeProfit: '',
    fees: '0',
    strategy: '',
    setupType: '',
    timeframe: '',
    notes: '',
    emotions: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert string values to numbers where needed
    const tradeData = {
      ...formData,
      entryPrice: parseFloat(formData.entryPrice),
      exitPrice: formData.exitPrice ? parseFloat(formData.exitPrice) : undefined,
      quantity: parseFloat(formData.quantity),
      stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : undefined,
      takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit) : undefined,
      fees: formData.fees ? parseFloat(formData.fees) : 0
    };
    
    // Remove undefined values
    Object.keys(tradeData).forEach(key => 
      tradeData[key] === undefined && delete tradeData[key]
    );
    
    dispatch(createTrade(tradeData))
      .unwrap()
      .then(() => {
        if (onSuccess) onSuccess();
      })
      .catch(err => {
        console.error('Failed to create trade:', err);
      });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="symbol" className="form-label">Symbol</label>
          <input
            type="text"
            id="symbol"
            name="symbol"
            className="form-input"
            placeholder="e.g. AAPL, BTC/USD"
            value={formData.symbol}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="direction" className="form-label">Direction</label>
          <select
            id="direction"
            name="direction"
            className="form-input"
            value={formData.direction}
            onChange={handleChange}
            required
          >
            <option value="LONG">Long</option>
            <option value="SHORT">Short</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="entryPrice" className="form-label">Entry Price</label>
          <input
            type="number"
            id="entryPrice"
            name="entryPrice"
            className="form-input"
            step="any"
            min="0"
            value={formData.entryPrice}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            className="form-input"
            step="any"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="entryTime" className="form-label">Entry Time</label>
          <input
            type="datetime-local"
            id="entryTime"
            name="entryTime"
            className="form-input"
            value={formData.entryTime}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            id="status"
            name="status"
            className="form-input"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
        
        {formData.status === 'CLOSED' && (
          <>
            <div className="form-group">
              <label htmlFor="exitPrice" className="form-label">Exit Price</label>
              <input
                type="number"
                id="exitPrice"
                name="exitPrice"
                className="form-input"
                step="any"
                min="0"
                value={formData.exitPrice}
                onChange={handleChange}
                required={formData.status === 'CLOSED'}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="exitTime" className="form-label">Exit Time</label>
              <input
                type="datetime-local"
                id="exitTime"
                name="exitTime"
                className="form-input"
                value={formData.exitTime}
                onChange={handleChange}
                required={formData.status === 'CLOSED'}
              />
            </div>
          </>
        )}
        
        <div className="form-group">
          <label htmlFor="stopLoss" className="form-label">Stop Loss</label>
          <input
            type="number"
            id="stopLoss"
            name="stopLoss"
            className="form-input"
            step="any"
            min="0"
            value={formData.stopLoss}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="takeProfit" className="form-label">Take Profit</label>
          <input
            type="number"
            id="takeProfit"
            name="takeProfit"
            className="form-input"
            step="any"
            min="0"
            value={formData.takeProfit}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="fees" className="form-label">Fees</label>
          <input
            type="number"
            id="fees"
            name="fees"
            className="form-input"
            step="any"
            min="0"
            value={formData.fees}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="timeframe" className="form-label">Timeframe</label>
          <select
            id="timeframe"
            name="timeframe"
            className="form-input"
            value={formData.timeframe}
            onChange={handleChange}
          >
            <option value="">Select Timeframe</option>
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
        
        <div className="form-group">
          <label htmlFor="strategy" className="form-label">Strategy</label>
          <input
            type="text"
            id="strategy"
            name="strategy"
            className="form-input"
            value={formData.strategy}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="setupType" className="form-label">Setup Type</label>
          <input
            type="text"
            id="setupType"
            name="setupType"
            className="form-input"
            value={formData.setupType}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="emotions" className="form-label">Emotions</label>
          <select
            id="emotions"
            name="emotions"
            className="form-input"
            value={formData.emotions}
            onChange={handleChange}
          >
            <option value="">Select Emotion</option>
            <option value="CONFIDENT">Confident</option>
            <option value="NERVOUS">Nervous</option>
            <option value="GREEDY">Greedy</option>
            <option value="FEARFUL">Fearful</option>
            <option value="CALM">Calm</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>
      
      <div className="form-group mt-4">
        <label htmlFor="notes" className="form-label">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows="4"
          className="form-input"
          value={formData.notes}
          onChange={handleChange}
        ></textarea>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onSuccess}
          className="btn btn-secondary mr-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Add Trade
        </button>
      </div>
    </form>
  );
};

export default TradeForm;