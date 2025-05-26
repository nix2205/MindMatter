import mongoose from 'mongoose';

const affirmationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Affirmation = mongoose.model('Affirmation', affirmationSchema);
export default Affirmation;
