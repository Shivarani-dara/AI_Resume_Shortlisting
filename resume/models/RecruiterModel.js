import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const RecruiterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'recruiter' },
  company: {
    name: String,
    website: String,
    description: String,
    size: String,
    industry: String
  },
  profile: {
    phone: String,
    location: String,
    linkedin: String
  },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
RecruiterSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
RecruiterSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Recruiter', RecruiterSchema);
