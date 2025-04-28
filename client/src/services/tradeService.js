// client/src/services/tradeService.js (Updated)
import api from './api';

// Get all trades
export const getTrades = async () => {
  const response = await api.get('/trades');
  return response.data;
};

// Get a single trade
export const getTrade = async (id) => {
  const response = await api.get(`/trades/${id}`);
  return response.data;
};

// Create a new trade
export const createTrade = async (tradeData) => {
  const response = await api.post('/trades', tradeData);
  return response.data;
};

// Update a trade
export const updateTrade = async (id, tradeData) => {
  const response = await api.put(`/trades/${id}`, tradeData);
  return response.data;
};

// Delete a trade
export const deleteTrade = async (id) => {
  const response = await api.delete(`/trades/${id}`);
  return response.data;
};

// Get trade statistics
export const getTradeStats = async () => {
  const response = await api.get('/trades/stats/summary');
  return response.data;
};

// Import trades from CSV
export const importTrades = async (formData) => {
  const response = await api.post('/trades/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};