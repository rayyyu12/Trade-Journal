// client/src/components/journal/TradeNotes.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTrade } from '../../store/actions/tradeActions';
import Card from '../common/Card';
import Button from '../common/Button';

const TradeNotes = ({ trade }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(trade.notes || '');

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(updateTrade({ 
        id: trade._id, 
        tradeData: { notes } 
      })).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update notes:', error);
    }
  };

  return (
    <Card 
      title="Trade Notes"
      footer={
        isEditing ? (
          <div className="flex justify-end space-x-2">
            <Button 
              variant="secondary" 
              onClick={() => {
                setNotes(trade.notes || '');
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
            >
              Save Notes
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            onClick={handleEditToggle}
          >
            Edit Notes
          </Button>
        )
      }
    >
      {isEditing ? (
        <textarea
          className="form-input w-full h-40"
          value={notes}
          onChange={handleNotesChange}
          placeholder="Add your trade notes, observations, and lessons learned..."
        ></textarea>
      ) : (
        <div className="prose max-w-none">
          {trade.notes ? (
            <p className="whitespace-pre-line">{trade.notes}</p>
          ) : (
            <p className="text-secondary-500 italic">No notes added for this trade.</p>
          )}
        </div>
      )}
    </Card>
  );
};

export default TradeNotes;