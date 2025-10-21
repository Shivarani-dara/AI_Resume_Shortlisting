import mongoose from 'mongoose';

const ScoreSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  score: Number,
  rationale: [String],
  recommendedAction: String,
  createdAt: { type: Date, default: Date.now }
});

const ResumeSchema = new mongoose.Schema({
  filename: String,
  filepath: String,
  extracted: { type: mongoose.Schema.Types.Mixed },
  text: String,
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  scores: [ScoreSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Resume', ResumeSchema);
