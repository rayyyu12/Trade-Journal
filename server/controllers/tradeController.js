const Trade = require('../models/Trade');
const { validationResult } = require('express-validator');

// @route   GET api/trades
// @desc    Get all trades for a user
// @access  Private
exports.getTrades = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user.id }).sort({ entryTime: -1 });
    res.json(trades);
  } catch (err) {
    console.error('Get trades error:', err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/trades/:id
// @desc    Get trade by ID
// @access  Private
exports.getTradeById = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    
    // Check if trade exists
    if (!trade) {
      return res.status(404).json({ msg: 'Trade not found' });
    }

    // Check if user owns trade
    if (trade.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(trade);
  } catch (err) {
    console.error('Get trade by ID error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Trade not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   POST api/trades
// @desc    Create a trade
// @access  Private
exports.createTrade = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newTrade = new Trade({
      user: req.user.id,
      ...req.body
    });

    if (newTrade.status === 'CLOSED') {
      newTrade.calculateProfitLoss();
    }

    const trade = await newTrade.save();
    res.json(trade);
  } catch (err) {
    console.error('Create trade error:', err.message);
    res.status(500).send('Server error');
  }
};

// @route   PUT api/trades/:id
// @desc    Update a trade
// @access  Private
exports.updateTrade = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let trade = await Trade.findById(req.params.id);
    
    // Check if trade exists
    if (!trade) {
      return res.status(404).json({ msg: 'Trade not found' });
    }

    // Check if user owns trade
    if (trade.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Update trade
    trade = await Trade.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (trade.status === 'CLOSED') {
      trade.calculateProfitLoss();
      await trade.save();
    }

    res.json(trade);
  } catch (err) {
    console.error('Update trade error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Trade not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   DELETE api/trades/:id
// @desc    Delete a trade
// @access  Private
exports.deleteTrade = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    
    // Check if trade exists
    if (!trade) {
      return res.status(404).json({ msg: 'Trade not found' });
    }

    // Check if user owns trade
    if (trade.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await trade.deleteOne();
    res.json({ msg: 'Trade removed' });
  } catch (err) {
    console.error('Delete trade error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Trade not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   GET api/trades/stats
// @desc    Get trade statistics
// @access  Private
exports.getTradeStats = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user.id, status: 'CLOSED' });
    
    if (trades.length === 0) {
      return res.json({
        totalTrades: 0,
        winRate: 0,
        totalProfitLoss: 0,
        avgProfitLoss: 0
      });
    }

    const winningTrades = trades.filter(trade => trade.isWin);
    const totalProfitLoss = trades.reduce((acc, trade) => acc + trade.profitLoss, 0);
    
    const stats = {
      totalTrades: trades.length,
      winRate: (winningTrades.length / trades.length) * 100,
      totalProfitLoss,
      avgProfitLoss: totalProfitLoss / trades.length
    };

    res.json(stats);
  } catch (err) {
    console.error('Get trade stats error:', err.message);
    res.status(500).send('Server error');
  }
};