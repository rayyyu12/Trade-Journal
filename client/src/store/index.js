import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import tradeReducer from './reducers/tradeReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    trades: tradeReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export default store;