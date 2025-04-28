// server/models/Trade.js (updated)
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
  },
  images: [{
    url: String,
    caption: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  rMultiple: {
    type: Number
  },
  holdTime: {
    type: Number // in minutes
  },
  // New fields for P/L calculation
  pointValue: {
    type: Number
  },
  manualProfitLoss: {
    type: Number
  },
  instrumentType: {
    type: String,
    enum: ['FUTURES', 'STOCK', 'OPTION', 'CRYPTO', 'FOREX', 'OTHER'],
    default: 'OTHER'
  }
}, { timestamps: true });

// Method to calculate profit/loss
TradeSchema.methods.calculateProfitLoss = function() {
  if (this.status === 'CLOSED') {
    // If manual P/L is provided, use that
    if (this.manualProfitLoss !== undefined && this.manualProfitLoss !== null) {
      this.profitLoss = this.manualProfitLoss - (this.fees || 0);
    }
    // If it's a futures contract with pointValue
    else if (this.pointValue && this.entryPrice && this.exitPrice) {
      const priceDiff = this.direction === 'LONG'
        ? (this.exitPrice - this.entryPrice)
        : (this.entryPrice - this.exitPrice);
      
      this.profitLoss = (priceDiff * this.pointValue * this.quantity) - (this.fees || 0);
    }
    // Default calculation (direct price difference)
    else if (this.entryPrice && this.exitPrice) {
      if (this.direction === 'LONG') {
        this.profitLoss = ((this.exitPrice - this.entryPrice) * this.quantity) - (this.fees || 0);
      } else {
        this.profitLoss = ((this.entryPrice - this.exitPrice) * this.quantity) - (this.fees || 0);
      }
    } else {
      this.profitLoss = 0;
    }
    
    // Calculate percentage P/L
    if (this.entryPrice && this.quantity) {
      this.profitLossPercentage = (this.profitLoss / (this.entryPrice * this.quantity)) * 100;
    }
    
    // Determine if win or loss
    this.isWin = this.profitLoss > 0;
    
    // Calculate R-Multiple if stop loss is set
    if (this.stopLoss) {
      const risk = Math.abs(this.entryPrice - this.stopLoss);
      if (risk > 0) {
        const reward = this.direction === 'LONG'
          ? (this.exitPrice - this.entryPrice)
          : (this.entryPrice - this.exitPrice);
          
        // For futures with point value, adjust R calculation
        if (this.pointValue) {
          this.rMultiple = (reward / risk);
        } else {
          this.rMultiple = (reward / risk);
        }
      }
    }
    
    // Calculate hold time
    if (this.entryTime && this.exitTime) {
      const entryDate = new Date(this.entryTime);
      const exitDate = new Date(this.exitTime);
      this.holdTime = Math.round((exitDate - entryDate) / (1000 * 60)); // in minutes
    }
    
    return this.profitLoss;
  }
  return 0;
};

module.exports = mongoose.model('Trade', TradeSchema);