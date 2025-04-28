// server/models/TradeNote.js
const mongoose = require('mongoose');

const TradeNoteSchema = new mongoose.Schema({
  trade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trade',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('TradeNote', TradeNoteSchema);