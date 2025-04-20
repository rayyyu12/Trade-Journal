// client/src/pages/JournalPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTrades } from '../store/actions/tradeActions';
import TradeForm from '../components/journal/TradeForm';
import TradeList from '../components/journal/TradeList';
import TradeFilters from '../components/journal/TradeFilters';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';

const JournalPage = () => {
  const dispatch = useDispatch();
  const { trades, loading } = useSelector(state => state.trades);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filteredTrades, setFilteredTrades] = useState([]);
  const [filters, setFilters] = useState({
    symbol: '',
    direction: '',
    status: '',
    startDate: null,
    endDate: null
  });
  
  useEffect(() => {
    dispatch(getTrades());
  }, [dispatch]);
  
  // Define applyFilters outside of useEffect to avoid the dependency warning
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
    
    setFilteredTrades(result);
  };
  
  useEffect(() => {
    if (trades.length > 0) {
      applyFilters();
    } else {
      setFilteredTrades([]);
    }
  }, [trades, filters, applyFilters]); // Added applyFilters to dependency array
  
  const onFilterChange = newFilters => {
    setFilters(newFilters);
  };
  
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  
  const closeAddModal = () => {
    setIsAddModalOpen(false);
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
        <button
          onClick={openAddModal}
          className="btn btn-primary"
        >
          Add New Trade
        </button>
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
    </div>
  );
};

export default JournalPage;