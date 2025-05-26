import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  frequency: { type: String },
  completedDates: [{ type: Date }]
});

const Habit = mongoose.model('Habit', habitSchema);
export default Habit;
