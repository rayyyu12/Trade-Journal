import { createAsyncThunk } from '@reduxjs/toolkit';
import * as tradeService from '../../services/tradeService';

// Get all trades
export const getTrades = createAsyncThunk(
  'trades/getTrades',
  async (_, { rejectWithValue }) => {
    try {
      return await tradeService.getTrades();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || 
        'Failed to fetch trades'
      );
    }
  }
);

// Get a single trade
export const getTrade = createAsyncThunk(
  'trades/getTrade',
  async (id, { rejectWithValue }) => {
    try {
      return await tradeService.getTrade(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || 
        'Failed to fetch trade'
      );
    }
  }
);

// Create a new trade
export const createTrade = createAsyncThunk(
  'trades/createTrade',
  async (tradeData, { rejectWithValue }) => {
    try {
      return await tradeService.createTrade(tradeData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors?.[0]?.msg || 
        error.response?.data?.msg || 
        'Failed to create trade'
      );
    }
  }
);

// Update a trade
export const updateTrade = createAsyncThunk(
  'trades/updateTrade',
  async ({ id, tradeData }, { rejectWithValue }) => {
    try {
      return await tradeService.updateTrade(id, tradeData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors?.[0]?.msg || 
        error.response?.data?.msg || 
        'Failed to update trade'
      );
    }
  }
);

// Delete a trade
export const deleteTrade = createAsyncThunk(
  'trades/deleteTrade',
  async (id, { rejectWithValue }) => {
    try {
      await tradeService.deleteTrade(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || 
        'Failed to delete trade'
      );
    }
  }
);

// Get trade statistics
export const getTradeStats = createAsyncThunk(
  'trades/getTradeStats',
  async (_, { rejectWithValue }) => {
    try {
      return await tradeService.getTradeStats();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || 
        'Failed to fetch trade statistics'
      );
    }
  }
);