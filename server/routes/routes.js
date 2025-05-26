import express from 'express';
import Todo from '../models/Todo.js';
import Mood from '../models/Mood.js';
import Habit from '../models/Habit.js';
import Affirmation from '../models/Affirmation.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import protect from '../middleware/auth.js';
import MoodEntry from '../models/MoodEntry.js';
// import authMiddleware from './middleware/authMiddleware.js';

const router = express.Router();

// ------------------- PROTECTED TEST -------------------
router.get('/protected', protect, (req, res) => {
  res.json({ message: `Welcome ${req.user.username}, this is a protected route.` });
});

// ------------------- REGISTER -------------------
router.post('/users/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ username, email, password });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user: { id: newUser._id, username, email }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- LOGIN -------------------
router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ user: { id: user._id, username: user.username, email }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- TEST -------------------
router.get('/', (req, res) => {
  res.send('API is working, my Tesoro 💖');
});

// ------------------- TODOS -------------------
router.post('/todos', protect, async (req, res) => {
  try {
    const todo = new Todo({ ...req.body, user: req.user.id });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/todos', protect, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- MOODS -------------------
router.post('/moods', protect, async (req, res) => {
  try {
    const mood = new Mood({ ...req.body, user: req.user.id });
    await mood.save();
    res.status(201).json(mood);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/moods', protect, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- HABITS -------------------
router.post('/habits', protect, async (req, res) => {
  try {
    const habit = new Habit({ ...req.body, user: req.user.id });
    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/habits', protect, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/affirmations', protect, async (req, res) => {
  console.log('BODY:', req.body);
  console.log('USER:', req.user);

  try {
    const affirmation = new Affirmation({ ...req.body, user: req.user.id });
    await affirmation.save();
    res.status(201).json(affirmation);
  } catch (err) {
    console.error('SAVE ERROR:', err);
    res.status(400).json({ error: err.message });
  }
});


router.get('/affirmations', protect, async (req, res) => {
  try {
    const affirmations = await Affirmation.find({ user: req.user.id });
    res.json(affirmations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a Random Affirmation
router.get('/affirmations/random', protect, async (req, res) => {
  try {
    const affirmations = await Affirmation.find({ user: req.user.id });
    if (affirmations.length === 0) {
      return res.status(404).json({ message: 'No affirmations found' });
    }

    const randomIndex = Math.floor(Math.random() * affirmations.length);
    res.json(affirmations[randomIndex]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an Affirmation
router.put('/affirmations/:id', protect, async (req, res) => {
  try {
    const affirmation = await Affirmation.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { message: req.body.message },
      { new: true }
    );
    if (!affirmation) {
      return res.status(404).json({ message: 'Affirmation not found' });
    }
    res.json(affirmation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an Affirmation
router.delete('/affirmations/:id', protect, async (req, res) => {
  try {
    const affirmation = await Affirmation.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!affirmation) {
      return res.status(404).json({ message: 'Affirmation not found' });
    }
    res.json({ message: 'Affirmation deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


//mood save
// ------------------- MOOD ENTRY SAVE -------------------
router.post('/moods/save', protect, async (req, res) => {
//    console.log('Incoming mood body:', req.body); // 👈 ADD THIS

  try {
    const { date, mood, rating, color } = req.body;
    const userId = req.user.id;

    if (!date || !mood || rating == null || !color) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    let entry = await MoodEntry.findOne({ userId, date });

    if (entry) {
      entry.mood = mood;
      entry.rating = rating;
      entry.color = color;
      await entry.save();
    } else {
      entry = new MoodEntry({ userId, date, mood, rating, color });
      await entry.save();
    }

    res.status(200).json(entry);
  } catch (err) {
    console.error('Error saving mood entry:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ------------------- GET MOOD ENTRIES -------------------
router.get('/moods/save', protect, async (req, res) => {
  try {
    const entries = await MoodEntry.find({ userId: req.user.id });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



export default router;
