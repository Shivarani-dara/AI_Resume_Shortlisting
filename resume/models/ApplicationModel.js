import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  status: { type: String, enum: ['applied', 'shortlisted', 'interview', 'rejected'], default: 'applied' },
  appliedAt: { type: Date, default: Date.now },
  atsScore: Number,
  rationale: [String],
  recommendedAction: String
});

export default mongoose.model('Application', ApplicationSchema);
