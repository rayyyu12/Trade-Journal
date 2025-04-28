// server/routes/trades.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const tradeController = require('../controllers/tradeController');
const auth = require('../middleware/auth');

// Make sure the route handler is correctly referenced
// The order of routes is important - specific routes first
router.get('/stats/summary', auth, tradeController.getTradeStats);

// @route   GET api/trades
// @desc    Get all trades for a user
// @access  Private
router.get('/', auth, tradeController.getTrades);

// @route   GET api/trades/:id
// @desc    Get trade by ID
// @access  Private
router.get('/:id', auth, tradeController.getTradeById);

// @route   POST api/trades
// @desc    Create a trade
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('symbol', 'Symbol is required').not().isEmpty(),
      check('direction', 'Direction is required').isIn(['LONG', 'SHORT']),
      check('entryPrice', 'Entry price is required').isNumeric(),
      check('quantity', 'Quantity is required').isNumeric(),
      check('entryTime', 'Entry time is required').not().isEmpty(),
      check('pointValue', 'Point value must be a number if provided').optional().isNumeric(),
      check('manualProfitLoss', 'Manual profit/loss must be a number if provided').optional().isNumeric()
    ]
  ],
  tradeController.createTrade
);

// Update the PUT route for updating trades
router.put(
  '/:id',
  [
    auth,
    [
      check('pointValue', 'Point value must be a number if provided').optional().isNumeric(),
      check('manualProfitLoss', 'Manual profit/loss must be a number if provided').optional().isNumeric()
    ]
  ],
  tradeController.updateTrade
);

// @route   DELETE api/trades/:id
// @desc    Delete a trade
// @access  Private
router.delete('/:id', auth, tradeController.deleteTrade);

// @route   POST api/trades/import
// @desc    Import trades from CSV
// @access  Private
router.post('/import', auth, tradeController.importTrades);

module.exports = router;