// server/controllers/tradeController.js
const Trade = require('../models/Trade');
const { validationResult } = require('express-validator');
const csvParser = require('../services/csvParser');

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
// server/controllers/tradeController.js (partial update)

// Update the createTrade function to handle point values
exports.createTrade = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Get the trade data from the request body
    const tradeData = { ...req.body, user: req.user.id };
    
    // Create the new trade
    const newTrade = new Trade(tradeData);

    // Calculate profit/loss if the trade is closed
    if (newTrade.status === 'CLOSED') {
      newTrade.calculateProfitLoss();
    }

    // Save the trade
    const trade = await newTrade.save();
    res.json(trade);
  } catch (err) {
    console.error('Create trade error:', err.message);
    res.status(500).send('Server error');
  }
};

// Update the updateTrade function to properly handle point values and manual P/L
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

    // Update trade with new values
    const updatedFields = { ...req.body };
    
    // Handle manual profit/loss field specifically
    if (updatedFields.manualProfitLoss === undefined && trade.manualProfitLoss !== undefined) {
      // If the request doesn't have manualProfitLoss but the trade does, we need to explicitly remove it
      updatedFields.manualProfitLoss = null;
    }
    
    // Update the trade
    trade = await Trade.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    // Recalculate profit/loss if the trade is closed
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

// @route   GET api/trades/stats/summary
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

// @route   POST api/trades/import
// @desc    Import trades from CSV
// @access  Private
exports.importTrades = async (req, res) => {
  try {
    const broker = req.body.broker || 'generic';
    
    // Parse CSV file
    const trades = await csvParser.parseCSV(req, broker);
    
    if (!trades || trades.length === 0) {
      return res.status(400).json({ msg: 'No valid trades found in the CSV file' });
    }
    
    // Insert trades into database
    const insertedTrades = await Trade.insertMany(trades);
    
    // Calculate profit/loss for closed trades
    for (const trade of insertedTrades) {
      if (trade.status === 'CLOSED') {
        trade.calculateProfitLoss();
        await trade.save();
      }
    }
    
    res.json({
      success: true,
      count: insertedTrades.length,
      trades: insertedTrades
    });
  } catch (err) {
    console.error('Import trades error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};