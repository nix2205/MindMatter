import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String, // format: YYYY-MM-DD
    required: true,
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'fear', 'disgust', 'neutral'],
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  emoji:{
    type:String, 
    required: true,
  } 
}, {
  timestamps: true
});

const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);
export default MoodEntry;
