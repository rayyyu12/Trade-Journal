const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  direction: {
    type: String,
    enum: ['LONG', 'SHORT'],
    required: true
  },
  entryPrice: {
    type: Number,
    required: true
  },
  exitPrice: {
    type: Number
  },
  quantity: {
    type: Number,
    required: true
  },
  entryTime: {
    type: Date,
    required: true
  },
  exitTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['OPEN', 'CLOSED'],
    default: 'OPEN'
  },
  profitLoss: {
    type: Number
  },
  profitLossPercentage: {
    type: Number
  },
  riskRewardRatio: {
    type: Number
  },
  stopLoss: {
    type: Number
  },
  takeProfit: {
    type: Number
  },
  fees: {
    type: Number,
    default: 0
  },
  strategy: {
    type: String
  },
  setupType: {
    type: String
  },
  timeframe: {
    type: String
  },
  notes: {
    type: String
  },
  isWin: {
    type: Boolean
  },
  tags: [String],
  mistakes: [String],
  emotions: {
    type: String,
    enum: ['CONFIDENT', 'NERVOUS', 'GREEDY', 'FEARFUL', 'CALM', 'OTHER']
  }
}, { timestamps: true });

// Method to calculate profit/loss
TradeSchema.methods.calculateProfitLoss = function() {
  if (this.status === 'CLOSED' && this.entryPrice && this.exitPrice && this.quantity) {
    if (this.direction === 'LONG') {
      this.profitLoss = (this.exitPrice - this.entryPrice) * this.quantity - this.fees;
    } else {
      this.profitLoss = (this.entryPrice - this.exitPrice) * this.quantity - this.fees;
    }
    
    this.profitLossPercentage = (this.profitLoss / (this.entryPrice * this.quantity)) * 100;
    this.isWin = this.profitLoss > 0;
    
    return this.profitLoss;
  }
  return 0;
};

module.exports = mongoose.model('Trade', TradeSchema);