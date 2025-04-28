// server/utils/dataImport.js
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// Helper to parse dates from various formats
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  
  // Try standard formats
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date;
  }
  
  // Try different formats
  // MM/DD/YYYY HH:MM:SS
  const dateRegex1 = /(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})/;
  if (dateRegex1.test(dateStr)) {
    const [, month, day, year, hours, minutes, seconds] = dateStr.match(dateRegex1);
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }
  
  // DD-MM-YYYY HH:MM
  const dateRegex2 = /(\d{1,2})-(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{2})/;
  if (dateRegex2.test(dateStr)) {
    const [, day, month, year, hours, minutes] = dateStr.match(dateRegex2);
    return new Date(year, month - 1, day, hours, minutes);
  }
  
  return null;
};

// Generic CSV parser
const parseGenericCSV = (filePath, userId) => {
  return new Promise((resolve, reject) => {
    const trades = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Map CSV columns to our trade model
        const trade = {
          user: userId,
          symbol: row.symbol || '',
          direction: (row.direction || '').toUpperCase(),
          entryPrice: parseFloat(row.entry_price) || 0,
          exitPrice: row.exit_price ? parseFloat(row.exit_price) : undefined,
          quantity: parseFloat(row.quantity) || 0,
          entryTime: parseDate(row.entry_time),
          exitTime: parseDate(row.exit_time),
          status: row.exit_price ? 'CLOSED' : 'OPEN',
          fees: row.fees ? parseFloat(row.fees) : 0,
          stopLoss: row.stop_loss ? parseFloat(row.stop_loss) : undefined,
          takeProfit: row.take_profit ? parseFloat(row.take_profit) : undefined,
          strategy: row.strategy || '',
          setupType: row.setup_type || '',
          timeframe: row.timeframe || '',
          notes: row.notes || ''
        };
        
        // Validate required fields
        if (trade.symbol && trade.direction && trade.entryPrice && trade.quantity && trade.entryTime) {
          trades.push(trade);
        }
      })
      .on('end', () => {
        resolve(trades);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Tradovate CSV parser
const parseTradovateCSV = (filePath, userId) => {
  return new Promise((resolve, reject) => {
    const trades = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Map Tradovate CSV columns to our trade model
        const direction = (row.Action || '').includes('Buy') ? 'LONG' : 'SHORT';
        const isClosed = (row.Status || '').includes('Filled') && row.ExitTime;
        
        const trade = {
          user: userId,
          symbol: row.Symbol || '',
          direction,
          entryPrice: parseFloat(row.Price) || 0,
          exitPrice: row.ExitPrice ? parseFloat(row.ExitPrice) : undefined,
          quantity: parseFloat(row.Qty) || 0,
          entryTime: parseDate(row.Time),
          exitTime: parseDate(row.ExitTime),
          status: isClosed ? 'CLOSED' : 'OPEN',
          fees: row.Commission ? parseFloat(row.Commission) : 0
        };
        
        // Validate required fields
        if (trade.symbol && trade.entryPrice && trade.quantity && trade.entryTime) {
          trades.push(trade);
        }
      })
      .on('end', () => {
        resolve(trades);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Rithmic CSV parser
const parseRithmicCSV = (filePath, userId) => {
  return new Promise((resolve, reject) => {
    const trades = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Map Rithmic CSV columns to our trade model
        const direction = (row.Side || '').includes('Buy') ? 'LONG' : 'SHORT';
        const isClosed = row.Status === 'Filled' && row.ExitTime;
        
        const trade = {
          user: userId,
          symbol: row.Symbol || '',
          direction,
          entryPrice: parseFloat(row.Price) || 0,
          exitPrice: row.ExitPrice ? parseFloat(row.ExitPrice) : undefined,
          quantity: parseFloat(row['Qty Filled']) || 0,
          entryTime: parseDate(row.Time),
          exitTime: parseDate(row.ExitTime),
          status: isClosed ? 'CLOSED' : 'OPEN',
          fees: row.Commission ? parseFloat(row.Commission) : 0
        };
        
        // Validate required fields
        if (trade.symbol && trade.entryPrice && trade.quantity && trade.entryTime) {
          trades.push(trade);
        }
      })
      .on('end', () => {
        resolve(trades);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Robinhood CSV parser
const parseRobinhoodCSV = (filePath, userId) => {
  return new Promise((resolve, reject) => {
    const trades = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Map Robinhood CSV columns to our trade model
        const isBuy = (row['Transaction Type'] || '').includes('Buy');
        const symbol = row.Symbol || row.Instrument;
        
        // Group by symbol to match buys with sells
        if (!trades[symbol]) {
          trades[symbol] = [];
        }
        
        const trade = {
          user: userId,
          symbol,
          direction: isBuy ? 'LONG' : 'SHORT',
          entryPrice: isBuy ? parseFloat(row.Price) : undefined,
          exitPrice: !isBuy ? parseFloat(row.Price) : undefined,
          quantity: parseFloat(row.Quantity) || 0,
          entryTime: isBuy ? parseDate(row.Date) : undefined,
          exitTime: !isBuy ? parseDate(row.Date) : undefined,
          status: 'OPEN',
          fees: row.Fees ? parseFloat(row.Fees) : 0
        };
        
        trades[symbol].push(trade);
      })
      .on('end', () => {
        // Process trades to match buys with sells
        const processedTrades = [];
        
        Object.values(trades).forEach(symbolTrades => {
          const buys = symbolTrades.filter(t => t.direction === 'LONG');
          const sells = symbolTrades.filter(t => t.direction !== 'LONG');
          
          buys.forEach(buy => {
            const sell = sells.find(s => s.quantity === buy.quantity);
            if (sell) {
              processedTrades.push({
                ...buy,
                exitPrice: sell.exitPrice,
                exitTime: sell.exitTime,
                status: 'CLOSED'
              });
            } else {
              processedTrades.push(buy);
            }
          });
        });
        
        resolve(processedTrades);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

module.exports = {
  parseGenericCSV,
  parseTradovateCSV,
  parseRithmicCSV,
  parseRobinhoodCSV
};