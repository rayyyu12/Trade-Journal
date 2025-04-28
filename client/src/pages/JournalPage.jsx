// client/src/pages/JournalPage.jsx (Updated)
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTrades } from '../store/actions/tradeActions';
import TradeForm from '../components/journal/TradeForm';
import TradeList from '../components/journal/TradeList';
import TradeFilters from '../components/journal/TradeFilters';
import ImportTrades from '../components/journal/ImportTrades';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';

const JournalPage = () => {
  const dispatch = useDispatch();
  const { trades, loading } = useSelector(state => state.trades);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [filteredTrades, setFilteredTrades] = useState([]);
  const [filters, setFilters] = useState({
    symbol: '',
    direction: '',
    status: '',
    startDate: null,
    endDate: null,
    strategy: '',
    setupType: '',
    timeframe: '',
    emotions: ''
  });
  
  useEffect(() => {
    dispatch(getTrades());
  }, [dispatch]);
  
  useEffect(() => {
    if (trades.length > 0) {
      applyFilters();
    } else {
      setFilteredTrades([]);
    }
  }, [trades, filters]);
  
  const applyFilters = () => {
    let result = [...trades];
    
    if (filters.symbol) {
      result = result.filter(trade => 
        trade.symbol.toLowerCase().includes(filters.symbol.toLowerCase())
      );
    }
    
    if (filters.direction) {
      result = result.filter(trade => trade.direction === filters.direction);
    }
    
    if (filters.status) {
      result = result.filter(trade => trade.status === filters.status);
    }
    
    if (filters.startDate) {
      result = result.filter(trade => 
        new Date(trade.entryTime) >= new Date(filters.startDate)
      );
    }
    
    if (filters.endDate) {
      result = result.filter(trade => 
        new Date(trade.entryTime) <= new Date(filters.endDate)
      );
    }
    
    if (filters.strategy) {
      result = result.filter(trade => 
        trade.strategy?.toLowerCase().includes(filters.strategy.toLowerCase())
      );
    }
    
    if (filters.setupType) {
      result = result.filter(trade => 
        trade.setupType?.toLowerCase().includes(filters.setupType.toLowerCase())
      );
    }
    
    if (filters.timeframe) {
      result = result.filter(trade => trade.timeframe === filters.timeframe);
    }
    
    if (filters.emotions) {
      result = result.filter(trade => trade.emotions === filters.emotions);
    }
    
    setFilteredTrades(result);
  };
  
  const onFilterChange = newFilters => {
    setFilters(newFilters);
  };
  
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };
  
  const openImportModal = () => {
    setIsImportModalOpen(true);
  };
  
  const closeImportModal = () => {
    setIsImportModalOpen(false);
  };
  
  if (loading && trades.length === 0) {
    return <Loading />;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary-900">
          Trade Journal
        </h1>
        <div className="space-x-2">
          <Button 
            onClick={openImportModal}
            variant="secondary"
          >
            Import Trades
          </Button>
          <Button
            onClick={openAddModal}
            variant="primary"
          >
            Add New Trade
          </Button>
        </div>
      </div>
      
      <TradeFilters 
        filters={filters} 
        onFilterChange={onFilterChange} 
      />
      
      <div className="mt-6">
        <TradeList 
          trades={filteredTrades} 
          loading={loading} 
        />
      </div>
      
      <Modal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        title="Add New Trade"
      >
        <TradeForm onSuccess={closeAddModal} />
      </Modal>

      <Modal
        isOpen={isImportModalOpen}
        onClose={closeImportModal}
        title="Import Trades"
        size="large"
      >
        <ImportTrades onClose={closeImportModal} />
      </Modal>
    </div>
  );
};

export default JournalPage;