const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  location: String,
  skills: [String],
  experience: Number,
  education: String,
  certifications: [String],
  expectedBudget: Number,
  parsedText: String,
});

module.exports = mongoose.model("Resume", resumeSchema);
