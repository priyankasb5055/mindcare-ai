import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
  },
  wordCount: {
    type: Number,
    default: 0,
  },
  isPrivate: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

journalSchema.pre('save', function () {
  if (this.isModified('content')) {
    this.wordCount = this.content
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0).length;
  }
});

const Journal = mongoose.model('Journal', journalSchema);
export default Journal;
