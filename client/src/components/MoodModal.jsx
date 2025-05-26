import React, { useEffect, useState } from 'react';
import './MoodModal.css';
import { FaStar } from 'react-icons/fa';
import PropTypes from 'prop-types';
import axiosInstance from '../api/axiosInstance';

const moodOptions = [
  { emoji: '😊', label: 'Happy', color: 'yellow' },
  { emoji: '😢', label: 'Sad', color: 'skyblue' },
  { emoji: '😱', label: 'Fear', color: 'plum' },
  { emoji: '😡', label: 'Anger', color: 'salmon' },
  { emoji: '😐', label: 'Neutral', color: 'gray' },
];

const MoodModal = ({ date, onClose, onSave, existingEntry }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingEntry) {
      const matchedMood = moodOptions.find(m => m.label.toLowerCase() === existingEntry.mood.toLowerCase());
      if (matchedMood) {
        setSelectedMood(matchedMood);
        setRating(existingEntry.rating);
      }
    }
  }, [existingEntry]);

  const handleSave = async () => {
  if (!selectedMood) return;

  const moodInfo = {
    date,
    mood: selectedMood.label,
    rating,
    color: selectedMood.color, // 🌟 Add this!
  };

  try {
    setLoading(true);
    await axiosInstance.post('/moods/save', moodInfo);
    onSave(date, {
      mood: selectedMood.emoji + ' ' + selectedMood.label,
      color: selectedMood.color,
      rating,
    });
    onClose(); // close modal on success
  } catch (err) {
    console.error('Failed to save mood entry:', err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="mood-modal-backdrop">
      <div className="mood-modal">
        <h2>{date}</h2>
        <h4>Select your mood:</h4>
        <div className="emoji-options">
          {moodOptions.map((mood, idx) => (
            <button
              key={idx}
              className={`mood-btn ${selectedMood?.label === mood.label ? 'selected' : ''}`}
              onClick={() => setSelectedMood(mood)}
              style={{ backgroundColor: mood.color }}
            >
              {mood.emoji}
            </button>
          ))}
        </div>

        <h4>Rate your day:</h4>
        <div className="star-rating">
          {[...Array(5)].map((_, i) => {
            const filled = i + 1 <= Math.round(rating);
            return (
              <FaStar
                key={i}
                size={24}
                color={filled ? '#ffc107' : '#e4e5e9'}
                onClick={() => setRating(i + 1)}
                style={{ cursor: 'pointer' }}
              />
            );
          })}
        </div>

        <div className="modal-actions">
          <button onClick={handleSave} disabled={!selectedMood || loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button onClick={onClose} disabled={loading}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

MoodModal.propTypes = {
  date: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  existingEntry: PropTypes.object, // optional
};

export default MoodModal;
