// server/services/csvParser.js
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const dataImport = require('../utils/dataImport');

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Parse CSV file
const parseCSV = async (req, broker) => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      
      try {
        const file = files.file && files.file[0];
        
        if (!file) {
          return reject(new Error('No file uploaded'));
        }
        
        if (file.mimetype !== 'text/csv' && !file.originalFilename.endsWith('.csv')) {
          return reject(new Error('Please upload a CSV file'));
        }
        
        const filePath = file.filepath;
        
        // Select parser based on broker
        let trades;
        switch (broker) {
          case 'tradovate':
            trades = await dataImport.parseTradovateCSV(filePath, req.user.id);
            break;
          case 'rithmic':
            trades = await dataImport.parseRithmicCSV(filePath, req.user.id);
            break;
          case 'robinhood':
            trades = await dataImport.parseRobinhoodCSV(filePath, req.user.id);
            break;
          case 'generic':
          default:
            trades = await dataImport.parseGenericCSV(filePath, req.user.id);
            break;
        }
        
        // Clean up uploaded file
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });
        
        resolve(trades);
      } catch (error) {
        reject(error);
      }
    });
  });
};

module.exports = { parseCSV };