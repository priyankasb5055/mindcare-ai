import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mood: {
    type: String,
    enum: ['great', 'good', 'okay', 'bad', 'terrible'],
    required: true,
  },
  moodScore: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  note: {
    type: String,
  },
  emoji: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  tags: [
    {
      type: String,
    },
  ],
});

const Mood = mongoose.model('Mood', moodSchema);
export default Mood;
