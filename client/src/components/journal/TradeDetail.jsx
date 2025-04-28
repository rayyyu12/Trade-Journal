// client/src/components/journal/TradeDetail.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateTrade } from '../../store/actions/tradeActions';
import { format } from 'date-fns';
import Card from '../common/Card';
import Button from '../common/Button';
import TradeNotes from './TradeNotes';
import { findInstrumentBySymbol } from '../../utils/instrumentUtils';

const TradeDetail = ({ trade, onClose }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [instrumentInfo, setInstrumentInfo] = useState(null);
  const [useManualPL, setUseManualPL] = useState(trade.manualProfitLoss !== undefined);
  const [formData, setFormData] = useState({
    exitPrice: '',
    exitTime: '',
    status: trade.status,
    notes: trade.notes || '',
    manualProfitLoss: trade.manualProfitLoss || ''
  });

  useEffect(() => {
    // Get instrument info if available
    const instrument = findInstrumentBySymbol(trade.symbol);
    setInstrumentInfo(instrument);
    
    // Check if trade uses manual P/L
    setUseManualPL(trade.manualProfitLoss !== undefined);
    
    // Set form data
    if (trade.exitPrice) setFormData(prev => ({ ...prev, exitPrice: trade.exitPrice }));
    if (trade.exitTime) setFormData(prev => ({ ...prev, exitTime: format(new Date(trade.exitTime), "yyyy-MM-dd'T'HH:mm") }));
    setFormData(prev => ({ 
      ...prev, 
      status: trade.status,
      notes: trade.notes || '',
      manualProfitLoss: trade.manualProfitLoss || '',
    }));
  }, [trade]);

  const handleClose = () => {
    onClose();
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleManualPL = () => {
    setUseManualPL(!useManualPL);
    if (useManualPL) {
      // Clear manual P/L when disabling
      setFormData(prev => ({
        ...prev,
        manualProfitLoss: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedData = {
      ...formData,
      exitPrice: formData.exitPrice ? parseFloat(formData.exitPrice) : undefined,
      manualProfitLoss: useManualPL && formData.manualProfitLoss ? parseFloat(formData.manualProfitLoss) : undefined,
    };

    // Remove manualProfitLoss if not using it
    if (!useManualPL) {
      delete updatedData.manualProfitLoss;
    }

    try {
      await dispatch(updateTrade({ id: trade._id, tradeData: updatedData })).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update trade:', error);
    }
  };

  const calculateRMultiple = () => {
    if (!trade.stopLoss || !trade.entryPrice || !trade.exitPrice) return 'N/A';
    
    const riskPerShare = Math.abs(trade.entryPrice - trade.stopLoss);
    if (riskPerShare === 0) return 'N/A';
    
    const rewardPerShare = trade.direction === 'LONG'
      ? trade.exitPrice - trade.entryPrice
      : trade.entryPrice - trade.exitPrice;
    
    return (rewardPerShare / riskPerShare).toFixed(2);
  };

  const formatProfitLoss = () => {
    if (trade.status !== 'CLOSED' || !trade.profitLoss) return '-';
    
    const formattedValue = `$${Math.abs(trade.profitLoss).toFixed(2)}`;
    
    if (instrumentInfo && trade.exitPrice && trade.entryPrice) {
      const points = Math.abs(
        trade.direction === 'LONG' 
          ? trade.exitPrice - trade.entryPrice
          : trade.entryPrice - trade.exitPrice
      ).toFixed(2);
      
      return `${formattedValue} (${points} points × $${instrumentInfo.pointValue})`;
    }
    
    return formattedValue;
  };

  const formatPriceDifference = () => {
    if (!trade.exitPrice || !trade.entryPrice) return 'N/A';
    
    const diff = trade.direction === 'LONG'
      ? trade.exitPrice - trade.entryPrice
      : trade.entryPrice - trade.exitPrice;
    
    const sign = diff > 0 ? '+' : '';
    return `${sign}${diff.toFixed(2)}`;
  };

  const getTradeResult = () => {
    if (trade.status !== 'CLOSED') return { text: 'Open', class: 'text-blue-600' };
    if (!trade.profitLoss) return { text: 'Unknown', class: 'text-secondary-600' };
    return trade.profitLoss > 0 
      ? { text: 'Win', class: 'text-success-600' }
      : { text: 'Loss', class: 'text-danger-600' };
  };

  const result = getTradeResult();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Trade Details: {trade.symbol} {trade.direction}
          {instrumentInfo && <span className="text-sm ml-1 text-secondary-500">({instrumentInfo.name})</span>}
        </h2>
        <div className="space-x-2">
          {!isEditing && trade.status === 'OPEN' && (
            <Button 
              variant="primary" 
              size="small" 
              onClick={handleEditToggle}
            >
              Close Trade
            </Button>
          )}
          <Button 
            variant="secondary" 
            size="small" 
            onClick={handleClose}
          >
            Back to List
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Trade Information">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-secondary-500">Symbol</p>
              <p className="font-medium">{trade.symbol}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Direction</p>
              <p className={`font-medium ${trade.direction === 'LONG' ? 'text-success-600' : 'text-danger-600'}`}>
                {trade.direction}
              </p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Status</p>
              <p className="font-medium">{trade.status}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Result</p>
              <p className={`font-medium ${result.class}`}>{result.text}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Entry Date</p>
              <p className="font-medium">{format(new Date(trade.entryTime), 'MMM dd, yyyy HH:mm')}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Exit Date</p>
              <p className="font-medium">
                {trade.exitTime ? format(new Date(trade.exitTime), 'MMM dd, yyyy HH:mm') : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Entry Price</p>
              <p className="font-medium">${trade.entryPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Exit Price</p>
              <p className="font-medium">
                {trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : '-'}
              </p>
            </div>
            {trade.exitPrice && (
              <div>
                <p className="text-sm text-secondary-500">Price Difference</p>
                <p className={`font-medium ${parseFloat(formatPriceDifference()) > 0 ? 'text-success-600' : parseFloat(formatPriceDifference()) < 0 ? 'text-danger-600' : ''}`}>
                  {formatPriceDifference()} points
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-secondary-500">Quantity</p>
              <p className="font-medium">{trade.quantity}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Fees</p>
              <p className="font-medium">${trade.fees ? trade.fees.toFixed(2) : '0.00'}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">P/L</p>
              <p className={`font-medium ${
                trade.profitLoss > 0 
                  ? 'text-success-600' 
                  : trade.profitLoss < 0 
                    ? 'text-danger-600' 
                    : ''
              }`}>
                {trade.profitLoss > 0 ? '+' : trade.profitLoss < 0 ? '-' : ''}
                {formatProfitLoss()}
              </p>
              {trade.manualProfitLoss !== undefined && (
                <p className="text-xs text-secondary-500 italic">Manually entered</p>
              )}
            </div>
            {trade.profitLossPercentage && (
              <div>
                <p className="text-sm text-secondary-500">P/L %</p>
                <p className={`font-medium ${
                  trade.profitLossPercentage > 0 
                    ? 'text-success-600' 
                    : trade.profitLossPercentage < 0 
                      ? 'text-danger-600' 
                      : ''
                }`}>
                  {trade.profitLossPercentage > 0 ? '+' : ''}
                  {trade.profitLossPercentage.toFixed(2)}%
                </p>
              </div>
            )}
            {trade.pointValue && (
              <div>
                <p className="text-sm text-secondary-500">Point Value</p>
                <p className="font-medium">${trade.pointValue}</p>
              </div>
            )}
          </div>
        </Card>

        <Card title="Risk Management">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-secondary-500">Stop Loss</p>
              <p className="font-medium">
                {trade.stopLoss ? `$${trade.stopLoss.toFixed(2)}` : 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Take Profit</p>
              <p className="font-medium">
                {trade.takeProfit ? `$${trade.takeProfit.toFixed(2)}` : 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">R-Multiple</p>
              <p className="font-medium">{calculateRMultiple()}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Risk per Share</p>
              <p className="font-medium">
                {trade.stopLoss 
                  ? `$${Math.abs(trade.entryPrice - trade.stopLoss).toFixed(2)}` 
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Strategy</p>
              <p className="font-medium">{trade.strategy || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Setup Type</p>
              <p className="font-medium">{trade.setupType || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Timeframe</p>
              <p className="font-medium">{trade.timeframe || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Emotional State</p>
              <p className="font-medium">{trade.emotions || 'Not recorded'}</p>
            </div>
            {trade.holdTime && (
              <div>
                <p className="text-sm text-secondary-500">Hold Time</p>
                <p className="font-medium">
                  {trade.holdTime > 60 
                    ? `${Math.floor(trade.holdTime / 60)}h ${trade.holdTime % 60}m` 
                    : `${trade.holdTime}m`}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {isEditing ? (
        <Card title="Close Trade">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  required={!useManualPL}
                  disabled={useManualPL}
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
                  required
                />
              </div>
              
              <div className="form-group md:col-span-2">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="useManualPL"
                    checked={useManualPL}
                    onChange={toggleManualPL}
                    className="h-4 w-4 text-primary-600 border-secondary-300 rounded"
                  />
                  <label htmlFor="useManualPL" className="ml-2 block text-sm text-secondary-900">
                    Manually enter P/L instead of calculating from prices
                  </label>
                </div>
                
                {useManualPL && (
                  <div className="form-group">
                    <label htmlFor="manualProfitLoss" className="form-label">Profit/Loss ($)</label>
                    <input
                      type="number"
                      id="manualProfitLoss"
                      name="manualProfitLoss"
                      className="form-input"
                      step="any"
                      value={formData.manualProfitLoss}
                      onChange={handleChange}
                      required={useManualPL}
                      placeholder="Enter your exact P/L in dollars"
                    />
                  </div>
                )}
                
                {!useManualPL && trade.pointValue && (
                  <div className="mt-1 text-sm">
                    <p className="text-secondary-600">
                      Using point value: ${trade.pointValue} per point
                    </p>
                    {formData.exitPrice && (
                      <p className="mt-1">
                        <span className="font-medium">Estimated P/L: </span>
                        {(() => {
                          const priceDiff = trade.direction === 'LONG'
                            ? formData.exitPrice - trade.entryPrice
                            : trade.entryPrice - formData.exitPrice;
                          const pl = priceDiff * trade.pointValue * trade.quantity - (trade.fees || 0);
                          return (
                            <span className={pl > 0 ? 'text-success-600' : pl < 0 ? 'text-danger-600' : ''}>
                              ${pl.toFixed(2)} ({Math.abs(priceDiff).toFixed(2)} points × ${trade.pointValue})
                            </span>
                          );
                        })()}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="form-group md:col-span-2">
                <label htmlFor="notes" className="form-label">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  className="form-input"
                  value={formData.notes}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                variant="secondary" 
                type="button" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <TradeNotes trade={trade} />
      )}
    </div>
  );
};

export default TradeDetail;