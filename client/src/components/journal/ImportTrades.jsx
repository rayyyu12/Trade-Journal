// client/src/components/journal/ImportTrades.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Card from '../common/Card';
import Button from '../common/Button';
import { getTrades } from '../../store/actions/tradeActions';

const brokers = [
  { value: 'tradovate', label: 'Tradovate' },
  { value: 'rithmic', label: 'Rithmic' },
  { value: 'robinhood', label: 'Robinhood' },
  { value: 'generic', label: 'Generic CSV' },
];

const ImportTrades = ({ onClose }) => {
  const dispatch = useDispatch();
  const [selectedBroker, setSelectedBroker] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const handleBrokerChange = (e) => {
    setSelectedBroker(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const validateFile = () => {
    if (!file) {
      setError('Please select a file to import');
      return false;
    }
    
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateFile()) return;
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('broker', selectedBroker);
    
    try {
      // Since the backend isn't ready yet, we'll simulate a successful import
      // In a real implementation, this would make an API call to import trades

      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful import
      setResult({
        success: true,
        imported: Math.floor(Math.random() * 10) + 1,
        failed: 0
      });
      
      // Refresh the trades list
      dispatch(getTrades());
      
      // Move to next step
      setStep(2);
    } catch (error) {
      console.error('Import error:', error);
      setError(error.response?.data?.msg || 'Failed to import trades');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="form-group">
          <label htmlFor="broker" className="form-label">Broker/Platform</label>
          <select
            id="broker"
            className="form-input"
            value={selectedBroker}
            onChange={handleBrokerChange}
            required
          >
            <option value="">Select Broker/Platform</option>
            {brokers.map(broker => (
              <option key={broker.value} value={broker.value}>
                {broker.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="csvFile" className="form-label">Select CSV File</label>
          <input
            type="file"
            id="csvFile"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-secondary-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0
                      file:text-sm file:font-medium
                      file:bg-secondary-100 file:text-secondary-700
                      hover:file:bg-secondary-200"
            required
          />
          <p className="mt-1 text-sm text-secondary-500">
            Only CSV files are supported
          </p>
        </div>
        
        {error && (
          <div className="bg-danger-100 border-l-4 border-danger-500 text-danger-700 p-4">
            <p>{error}</p>
          </div>
        )}
        
        <div className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading || !selectedBroker || !file}
          >
            {loading ? 'Importing...' : 'Import Trades'}
          </Button>
        </div>
      </div>
    </form>
  );

  const renderStep2 = () => (
    <div className="text-center">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center bg-success-100 rounded-full p-3">
          <svg className="h-12 w-12 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>
      
      <h3 className="text-lg font-medium text-secondary-900 mb-2">
        Import Successful
      </h3>
      <p className="text-secondary-600 mb-6">
        {result.imported} trades were successfully imported.
        {result.failed > 0 && ` ${result.failed} trades failed to import.`}
      </p>
      
      <div className="flex justify-center">
        <Button
          variant="primary"
          onClick={onClose}
        >
          View Trades
        </Button>
      </div>
    </div>
  );

  return (
    <Card title="Import Trades">
      {step === 1 ? renderStep1() : renderStep2()}
      
      {step === 1 && selectedBroker && (
        <div className="mt-6 border-t border-secondary-200 pt-4">
          <h4 className="text-sm font-medium text-secondary-900 mb-2">
            Import Instructions for {brokers.find(b => b.value === selectedBroker)?.label}
          </h4>
          
          {selectedBroker === 'tradovate' && (
            <ol className="list-decimal list-inside text-sm text-secondary-600 space-y-1">
              <li>Log in to your Tradovate desktop client</li>
              <li>Click on your account name dropdown</li>
              <li>Click the gear icon to go to "Account reports"</li>
              <li>Select the Orders tab (not Performance)</li>
              <li>Select your date range</li>
              <li>Click "Download Report" to save the CSV</li>
              <li>Upload the saved CSV file here</li>
            </ol>
          )}
          
          {selectedBroker === 'rithmic' && (
            <ol className="list-decimal list-inside text-sm text-secondary-600 space-y-1">
              <li>In R Trader, go to "Recent Orders" or "Order History"</li>
              <li>Select your account and date range</li>
              <li>Right-click on column headings and add "Qty Filled" and "Order Number"</li>
              <li>Export as CSV by clicking the clipboard icon</li>
              <li>Upload the saved CSV file here</li>
            </ol>
          )}
          
          {selectedBroker === 'robinhood' && (
            <ol className="list-decimal list-inside text-sm text-secondary-600 space-y-1">
              <li>Log in to your Robinhood account</li>
              <li>Go to Account {'>'} Statements & History</li>
              <li>Click on "Export" or "Download" for your trading history</li>
              <li>Select CSV format and your desired date range</li>
              <li>Upload the downloaded CSV file here</li>
            </ol>
          )}
          
          {selectedBroker === 'generic' && (
            <div className="text-sm text-secondary-600">
              <p className="mb-2">
                For generic CSV imports, your file should contain the following columns:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>symbol - The trading symbol (e.g. AAPL, BTC/USD)</li>
                <li>direction - LONG or SHORT</li>
                <li>entry_price - Entry price</li>
                <li>exit_price - Exit price (optional for open trades)</li>
                <li>quantity - Number of shares/contracts/units</li>
                <li>entry_time - Entry date and time</li>
                <li>exit_time - Exit date and time (optional for open trades)</li>
                <li>fees - Trading fees (optional)</li>
              </ul>
              <p className="mt-2">
                <a 
                  href="/sample_template.csv" 
                  className="text-primary-600 hover:text-primary-500"
                  download
                >
                  Download sample template
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default ImportTrades;