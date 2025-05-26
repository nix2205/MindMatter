// client/src/pages/AffirmationsPage.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const AffirmationsPage = () => {
  const [affirmations, setAffirmations] = useState([]);
  const [newAff, setNewAff] = useState('');

  const fetchAffirmations = async () => {
    try {
      const res = await axiosInstance.get('/affirmations');
      setAffirmations(res.data);
    } catch (error) {
      console.error('Failed to fetch affirmations:', error);
    }
  };

  useEffect(() => {
    fetchAffirmations();
  }, []);

  const handleAdd = async () => {
    if (!newAff.trim()) return;
    try {
      const res = await axiosInstance.post('/affirmations', { message: newAff });
      setAffirmations([...affirmations, res.data]);
      setNewAff('');
    } catch (err) {
      console.error('Failed to add affirmation:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/affirmations/${id}`);
      setAffirmations(affirmations.filter((a) => a._id !== id));
    } catch (err) {
      console.error('Failed to delete affirmation:', err);
    }
  };

  const handleEdit = async (id, message) => {
    try {
      await axiosInstance.put(`/affirmations/${id}`, { message });
      setAffirmations(
        affirmations.map((a) => (a._id === id ? { ...a, message } : a))
      );
    } catch (err) {
      console.error('Failed to update affirmation:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🌞 Affirmations Page</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={newAff}
          onChange={(e) => setNewAff(e.target.value)}
          placeholder="Add a new affirmation"
        />
        <button onClick={handleAdd}>➕ Add</button>
      </div>

      {affirmations.map((aff) => (
        <div key={aff._id} style={{ marginBottom: '0.5rem' }}>
          <input
            type="text"
            value={aff.message}
            onChange={(e) => handleEdit(aff._id, e.target.value)}
          />
          <button onClick={() => handleDelete(aff._id)}>🗑️</button>
        </div>
      ))}
    </div>
  );
};

export default AffirmationsPage;
