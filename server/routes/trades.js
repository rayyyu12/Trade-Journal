const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const tradeController = require('../controllers/tradeController');
const auth = require('../middleware/auth');

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
      check('entryTime', 'Entry time is required').not().isEmpty()
    ]
  ],
  tradeController.createTrade
);

// @route   PUT api/trades/:id
// @desc    Update a trade
// @access  Private
router.put('/:id', auth, tradeController.updateTrade);

// @route   DELETE api/trades/:id
// @desc    Delete a trade
// @access  Private
router.delete('/:id', auth, tradeController.deleteTrade);

// @route   GET api/trades/stats
// @desc    Get trade statistics
// @access  Private
router.get('/stats/summary', auth, tradeController.getTradeStats);

module.exports = router;