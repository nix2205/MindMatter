// client/src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import AffirmationsPage from './pages/AffirmationsPage';
import MoodTracker from './pages/MoodTracker'; // step 2 after creating jsx page

function App() {
  const token = localStorage.getItem('token');
// step 3 add route here also
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/affirmations" element={<AffirmationsPage />} />
        <Route path="/mood-tracker" element={<MoodTracker />} />  
        <Route
          path="*"
          element={
            <Navigate to={token ? '/dashboard' : '/login'} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
