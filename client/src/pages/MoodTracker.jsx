// client/src/pages/MoodTracker.jsx
import React, { useState, useRef, useEffect } from 'react';
import './MoodTracker.css';
import MoodModal from '../components/MoodModal';
import axiosInstance from '../api/axiosInstance';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const generateCalendar = (year) => {
  return Array.from({ length: 12 }, (_, i) => {
    const firstDay = new Date(year, i, 1);
    const totalDays = new Date(year, i + 1, 0).getDate();
    const startDay = (firstDay.getDay() + 6) % 7;
    const daysArray = Array(startDay).fill(null).concat(
      Array.from({ length: totalDays }, (_, j) => j + 1)
    );
    return {
      name: firstDay.toLocaleString('default', { month: 'long' }),
      month: i,
      year,
      daysArray,
    };
  });
};

const MoodTracker = () => {
  const [years, setYears] = useState([new Date().getFullYear()]);
  const [moodData, setMoodData] = useState({});
  const [modalDate, setModalDate] = useState(null);

  // ✅ NEW STATE to store the selected day's data
  const [selectedMoodEntry, setSelectedMoodEntry] = useState(null);

  const observer = useRef();
  const lastYearRef = useRef();

  const fetchMoods = async () => {
    try {
      const res = await axiosInstance.get('/moods');
      const moodMap = {};
      res.data.forEach((entry) => {
        moodMap[entry.date] = {
          mood: entry.mood,
          color: entry.color,
          rating: entry.rating,
        };
      });
      setMoodData(moodMap);
    } catch (err) {
      console.error('Failed to fetch mood data:', err);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  useEffect(() => {
    const observerCallback = (entries) => {
      if (entries[0].isIntersecting) {
        const lastYear = years[years.length - 1];
        setYears(prev => [...prev, lastYear + 1]);
      }
    };
    const current = lastYearRef.current;
    if (current) {
      observer.current = new IntersectionObserver(observerCallback);
      observer.current.observe(current);
    }
    return () => observer.current?.disconnect();
  }, [years]);

  const openModal = (year, month, day) => {
    const date = new Date(year, month, day).toISOString().split('T')[0];

    // ✅ Set selected mood entry if it exists for that date
    setSelectedMoodEntry(moodData[date] || null);

    setModalDate(date);
  };

  const handleSaveMood = (date, moodInfo) => {
    setMoodData(prev => ({ ...prev, [date]: moodInfo }));
    setModalDate(null);
  };

  return (
    <div className="mood-container">
      {years.map((year, yIdx) => {
        const months = generateCalendar(year);
        return (
          <div key={yIdx}>
            <h2>{year}</h2>
            <div className="year-grid">
              {months.map((month, index) => (
                <div className="month-tile" key={index}>
                  <h3>{month.name}</h3>
                  <div className="weekdays">
                    {days.map((d, i) => (
                      <div key={i} className="day-name">{d}</div>
                    ))}
                  </div>
                  <div className="month-days">
                    {month.daysArray.map((day, idx) => {
                      const dateKey = new Date(year, month.month, day).toISOString().split('T')[0];
                      const mood = moodData[dateKey];
                      return (
                        <div
                          key={idx}
                          className={`day-tile ${day ? '' : 'empty'}`}
                          style={{
                            backgroundColor: mood?.color,
                            borderRadius: '6px',
                            boxShadow: mood?.color ? '0 0 4px rgba(0,0,0,0.2)' : 'none',
                          }}
                          onClick={() => day && openModal(year, month.month, day)}
                        >
                          {day || ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <div ref={lastYearRef} style={{ height: '10px' }}></div>

      {modalDate && (
        <MoodModal
          date={modalDate}
          onClose={() => setModalDate(null)}
          onSave={handleSaveMood}
          existingEntry={selectedMoodEntry} // ✅ Pass existing mood data
        />
      )}
    </div>
  );
};

export default MoodTracker;
