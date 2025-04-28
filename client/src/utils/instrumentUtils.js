// client/src/utils/instrumentUtils.js
const instruments = [
    // Futures - Equity Index
    { 
      symbol: 'NQ', 
      name: 'NASDAQ 100 E-mini Futures',
      pointValue: 20,
      exchange: 'CME',
      category: 'Futures',
      subcategory: 'Equity Index'
    },
    { 
      symbol: 'MNQ', 
      name: 'NASDAQ 100 Micro E-mini Futures',
      pointValue: 2,
      exchange: 'CME',
      category: 'Futures',
      subcategory: 'Equity Index'
    },
    { 
      symbol: 'ES', 
      name: 'S&P 500 E-mini Futures',
      pointValue: 50,
      exchange: 'CME',
      category: 'Futures',
      subcategory: 'Equity Index'
    },
    { 
      symbol: 'MES', 
      name: 'S&P 500 Micro E-mini Futures',
      pointValue: 5,
      exchange: 'CME',
      category: 'Futures',
      subcategory: 'Equity Index'
    },
    { 
      symbol: 'YM', 
      name: 'Dow Jones E-mini Futures',
      pointValue: 5,
      exchange: 'CBOT',
      category: 'Futures',
      subcategory: 'Equity Index'
    },
    { 
      symbol: 'MYM', 
      name: 'Dow Jones Micro E-mini Futures',
      pointValue: 0.5,
      exchange: 'CBOT',
      category: 'Futures',
      subcategory: 'Equity Index'
    },
    { 
      symbol: 'RTY', 
      name: 'Russell 2000 E-mini Futures',
      pointValue: 50,
      exchange: 'CME',
      category: 'Futures',
      subcategory: 'Equity Index'
    },
    { 
      symbol: 'M2K', 
      name: 'Russell 2000 Micro E-mini Futures',
      pointValue: 5,
      exchange: 'CME',
      category: 'Futures',
      subcategory: 'Equity Index'
    },
    
    // Futures - Commodities
    { 
      symbol: 'CL', 
      name: 'Crude Oil Futures',
      pointValue: 1000,
      exchange: 'NYMEX',
      category: 'Futures',
      subcategory: 'Energy'
    },
    { 
      symbol: 'MCL', 
      name: 'Micro WTI Crude Oil Futures',
      pointValue: 100,
      exchange: 'NYMEX',
      category: 'Futures',
      subcategory: 'Energy'
    },
    { 
      symbol: 'GC', 
      name: 'Gold Futures',
      pointValue: 100,
      exchange: 'COMEX',
      category: 'Futures',
      subcategory: 'Metals'
    },
    { 
      symbol: 'MGC', 
      name: 'Micro Gold Futures',
      pointValue: 10,
      exchange: 'COMEX',
      category: 'Futures',
      subcategory: 'Metals'
    },
    { 
      symbol: 'SI', 
      name: 'Silver Futures',
      pointValue: 5000,
      exchange: 'COMEX',
      category: 'Futures',
      subcategory: 'Metals'
    },
    { 
      symbol: 'SIL', 
      name: 'Micro Silver Futures',
      pointValue: 1000,
      exchange: 'COMEX',
      category: 'Futures',
      subcategory: 'Metals'
    },
    { 
      symbol: 'HG', 
      name: 'Copper Futures',
      pointValue: 25000,
      exchange: 'COMEX',
      category: 'Futures',
      subcategory: 'Metals'
    },
    { 
      symbol: 'ZC', 
      name: 'Corn Futures',
      pointValue: 50,
      exchange: 'CBOT',
      category: 'Futures',
      subcategory: 'Agriculture'
    },
    { 
      symbol: 'ZW', 
      name: 'Wheat Futures',
      pointValue: 50,
      exchange: 'CBOT',
      category: 'Futures',
      subcategory: 'Agriculture'
    },
    
    // Futures - Currencies
    { 
      symbol: '6E', 
      name: 'Euro FX Futures',
      pointValue: 125000,
      exchange: 'CME',
      category: 'Futures',
      subcategory: 'Currencies'
    },
    { 
      symbol: 'M6E', 
      name: 'Micro Euro FX Futures',
      pointValue: 12500,
      exchange: 'CME',
      category: 'Futures',
      subcategory: 'Currencies'
    },
    { 
      symbol: '6J', 
      name: 'Japanese Yen Futures',
      pointValue: 12500000,
      exchange: 'CME',
      category: 'Futures',
      subcategory: 'Currencies'
    },
    
    // Futures - Bonds
    { 
      symbol: 'ZB', 
      name: '30-Year U.S. Treasury Bond Futures',
      pointValue: 1000,
      exchange: 'CBOT',
      category: 'Futures',
      subcategory: 'Interest Rates'
    },
    { 
      symbol: 'ZN', 
      name: '10-Year U.S. Treasury Note Futures',
      pointValue: 1000,
      exchange: 'CBOT',
      category: 'Futures',
      subcategory: 'Interest Rates'
    }
  ];
  
  // Function to find instrument by symbol
  const findInstrumentBySymbol = (symbol) => {
    if (!symbol) return null;
    
    const normalizedSymbol = symbol.toUpperCase().trim();
    return instruments.find(instrument => 
      instrument.symbol.toUpperCase() === normalizedSymbol
    );
  };
  
  // Function to get suggestions based on input
  const getInstrumentSuggestions = (input) => {
    if (!input) return [];
    
    const normalizedInput = input.toUpperCase().trim();
    return instruments.filter(instrument => 
      instrument.symbol.toUpperCase().includes(normalizedInput) ||
      instrument.name.toUpperCase().includes(normalizedInput)
    ).slice(0, 10); // Limit to 10 suggestions
  };
  
  // Function to calculate P/L based on instrument
  const calculateProfitLoss = (trade) => {
    const { 
      // Remove symbol from here since it's not used
      direction, 
      entryPrice, 
      exitPrice, 
      quantity, 
      fees = 0, 
      pointValue, 
      manualProfitLoss 
    } = trade;
  
    // If manual P/L is provided, use that
    if (manualProfitLoss !== undefined && manualProfitLoss !== null) {
      return manualProfitLoss - fees;
    }
    
    // If not a preset instrument and no manual value, calculate based on raw price difference
    if (!pointValue && exitPrice && entryPrice) {
      return direction === 'LONG'
        ? ((exitPrice - entryPrice) * quantity) - fees
        : ((entryPrice - exitPrice) * quantity) - fees;
    }
    
    // If it's a preset instrument with pointValue, use that for calculation
    if (pointValue && exitPrice && entryPrice) {
      const priceDiff = direction === 'LONG'
        ? (exitPrice - entryPrice)
        : (entryPrice - exitPrice);
      
      return (priceDiff * pointValue * quantity) - fees;
    }
    
    return 0;
  };
  
  export {
    instruments,
    findInstrumentBySymbol,
    getInstrumentSuggestions,
    calculateProfitLoss
  };