const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const tradesRoutes = require('./routes/trades');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trades', tradesRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('TradeZella Clone API Running');
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;