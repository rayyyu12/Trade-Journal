import { createSlice } from '@reduxjs/toolkit';
import { 
  getTrades, 
  getTrade, 
  createTrade, 
  updateTrade, 
  deleteTrade,
  getTradeStats
} from '../actions/tradeActions';

const initialState = {
  trades: [],
  currentTrade: null,
  stats: {
    totalTrades: 0,
    winRate: 0,
    totalProfitLoss: 0,
    avgProfitLoss: 0
  },
  loading: false,
  error: null
};

const tradeSlice = createSlice({
  name: 'trades',
  initialState,
  reducers: {
    clearTradeError: (state) => {
      state.error = null;
    },
    clearCurrentTrade: (state) => {
      state.currentTrade = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all trades
      .addCase(getTrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrades.fulfilled, (state, action) => {
        state.loading = false;
        state.trades = action.payload;
      })
      .addCase(getTrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get a single trade
      .addCase(getTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTrade = action.payload;
      })
      .addCase(getTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create a trade
      .addCase(createTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.trades = [action.payload, ...state.trades];
      })
      .addCase(createTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update a trade
      .addCase(updateTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.trades = state.trades.map(trade => 
          trade._id === action.payload._id ? action.payload : trade
        );
        state.currentTrade = action.payload;
      })
      .addCase(updateTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete a trade
      .addCase(deleteTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.trades = state.trades.filter(trade => trade._id !== action.payload);
      })
      .addCase(deleteTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get trade statistics
      .addCase(getTradeStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTradeStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getTradeStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearTradeError, clearCurrentTrade } = tradeSlice.actions;

export default tradeSlice.reducer;