// client/src/store/actions/authActions.js
import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';

// Clear errors action
export const clearError = createAction('auth/clearError');

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      authService.setAuthToken(data.token);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors?.[0]?.msg || 
        error.response?.data?.msg || 
        'Registration failed'
      );
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      authService.setAuthToken(data.token);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors?.[0]?.msg || 
        error.response?.data?.msg || 
        'Login failed'
      );
    }
  }
);

// Load user
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      if (!authService.isAuthenticated()) {
        return rejectWithValue('No token');
      }
      
      const user = await authService.getAuthUser();
      return user;
    } catch (error) {
      authService.setAuthToken(null);
      return rejectWithValue(
        error.response?.data?.msg || 
        'Authentication failed'
      );
    }
  }
);

// Logout
export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    authService.setAuthToken(null);
  }
);