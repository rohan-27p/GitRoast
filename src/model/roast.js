import mongoose from 'mongoose';

const RoastSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  repoName: {
    type: String,
    required: true,
  },
  roastLines: {
    type: [String],
    required: true,
  },
  isAIRoast: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Roast || mongoose.model('Roast', RoastSchema);