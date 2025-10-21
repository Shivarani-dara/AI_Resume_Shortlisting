import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: String,
  description: String,
  company: String,
  location: String,
  type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'], default: 'full-time' },
  salaryMin: Number,
  salaryMax: Number,
  skills: [String],
  experience: String,
  applicationDeadline: Date,
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer' }, // for future auth
  collectionName: String, // Name of the dynamic collection for this job's applications
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Job', JobSchema);
