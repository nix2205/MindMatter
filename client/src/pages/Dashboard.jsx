// client/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const Dashboard = () => {
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [moods, setMoods] = useState([]);
  const [habits, setHabits] = useState([]);
  const [randomAffirmation, setRandomAffirmation] = useState('Your Daily Affirmation');


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const [todosRes, moodsRes, habitsRes, affirmationsRes] = await Promise.all([
        axiosInstance.get('/todos'),
        axiosInstance.get('/moods'),
        axiosInstance.get('/habits'),
        axiosInstance.get('/affirmations'),
      ]);
      setTodos(todosRes.data);
      setMoods(moodsRes.data);
      setHabits(habitsRes.data);

      // 🌞 Pick a random affirmation once
      const random = affirmationsRes.data[Math.floor(Math.random() * affirmationsRes.data.length)];
      setRandomAffirmation(random ? random.message : 'Your Daily Affirmation');
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  fetchData();
}, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };


  return (
    <div style={{ padding: '2rem' }}>
      <button
        onClick={handleLogout}
        style={{
          float: 'right',
          backgroundColor: '#ff4d4d',
          color: '#fff',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        🚪 Logout
      </button>

      <h1>Welcome to your Dashboard 💖</h1>

      {/* Sparkly affirmation card */}
      <div
        style={{
          background: 'linear-gradient(to right, #fbc2eb, #a6c1ee)',
          padding: '1.5rem',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          marginBottom: '2rem',
          textAlign: 'center',
          fontSize: '1.3rem',
          fontWeight: 'bold',
        }}
      >
        ✨ {randomAffirmation} ✨
      </div>

      {/* Navigation buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/affirmations')}>🌞 Affirmations</button>
        <button onClick={() => alert('Todos page coming soon!')}>📝 Todos</button>
        <button onClick={() => navigate('/mood-tracker')}>💭 Moods</button>
        <button onClick={() => alert('Habits page coming soon!')}>🔥 Habits</button>
      </div>

      {/* You can keep the raw data here or remove it once pages are done */}
      <section>
        <h2>📝 Todos</h2>
        {todos.map((todo) => (
          <div key={todo._id}>
            <input type="checkbox" checked={todo.completed} readOnly />
            <span>{todo.task}</span>
          </div>
        ))}
      </section>

      <section>
        <h2>💭 Moods</h2>
        {moods.map((mood) => (
          <div key={mood._id}>
            <strong>{mood.mood}</strong> - {mood.note}
          </div>
        ))}
      </section>

      <section>
        <h2>🔥 Habits</h2>
        {habits.map((habit) => (
          <div key={habit._id}>
            <strong>{habit.name}</strong> - {habit.frequency}
          </div>
        ))}
      </section>

      
    </div>
  );
};

export default Dashboard;
