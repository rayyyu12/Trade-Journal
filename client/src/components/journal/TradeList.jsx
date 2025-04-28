// client/src/components/journal/TradeList.jsx (Updated)
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTrade } from '../../store/actions/tradeActions';
import { format } from 'date-fns';
import Table from '../common/Table';
import Modal from '../common/Modal';
import Button from '../common/Button';
import TradeDetail from './TradeDetail';

const TradeList = ({ trades, loading }) => {
  const dispatch = useDispatch();
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      dispatch(deleteTrade(id));
    }
  };
  
  const handleRowClick = (trade) => {
    setSelectedTrade(trade);
    setIsDetailModalOpen(true);
  };
  
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
  };
  
  const columns = [
    {
      header: 'Symbol',
      accessor: 'symbol',
      cell: (row) => (
        <div className="text-sm font-medium text-secondary-900">
          {row.symbol}
        </div>
      )
    },
    {
      header: 'Direction',
      accessor: 'direction',
      cell: (row) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          row.direction === 'LONG'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {row.direction}
        </span>
      )
    },
    {
      header: 'Entry Price',
      accessor: 'entryPrice',
      cell: (row) => (
        <div className="text-sm text-secondary-500">
          ${row.entryPrice.toFixed(2)}
        </div>
      )
    },
    {
      header: 'Exit Price',
      accessor: 'exitPrice',
      cell: (row) => (
        <div className="text-sm text-secondary-500">
          {row.exitPrice ? `$${row.exitPrice.toFixed(2)}` : '-'}
        </div>
      )
    },
    {
      header: 'Entry Time',
      accessor: 'entryTime',
      cell: (row) => (
        <div className="text-sm text-secondary-500">
          {format(new Date(row.entryTime), 'MMM dd, yyyy HH:mm')}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          row.status === 'OPEN'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-secondary-100 text-secondary-800'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'P/L',
      accessor: 'profitLoss',
      cellClassName: 'text-right',
      cell: (row) => (
        <div className="text-sm">
          {row.profitLoss !== undefined && row.status === 'CLOSED' ? (
            <span className={`font-medium ${
              row.profitLoss > 0 
                ? 'text-success-600' 
                : row.profitLoss < 0 
                  ? 'text-danger-600' 
                  : 'text-secondary-500'
            }`}>
              ${row.profitLoss.toFixed(2)}
            </span>
          ) : (
            <span className="text-secondary-400">-</span>
          )}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: '_id',
      cellClassName: 'text-right',
      cell: (row) => (
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(row);
            }}
          >
            View
          </Button>
          <Button
            variant="danger"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row._id);
            }}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];
  
  return (
    <>
      <Table
        columns={columns}
        data={trades}
        loading={loading}
        onRowClick={handleRowClick}
        emptyMessage="No trades found. Add your first trade to get started!"
        className="card"
      />
      
      <Modal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        title="Trade Details"
        size="large"
      >
        {selectedTrade && (
          <TradeDetail 
            trade={selectedTrade} 
            onClose={closeDetailModal} 
          />
        )}
      </Modal>
    </>
  );
};

export default TradeList;