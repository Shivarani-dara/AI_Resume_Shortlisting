import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'candidate' },
  profile: {
    phone: String,
    location: String,
    skills: [String],
    experience: String,
    resume: String // file path or URL
  },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
CandidateSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
CandidateSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Candidate', CandidateSchema);
