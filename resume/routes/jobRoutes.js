import express from 'express';
import Job from '../models/JobModel.js';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { authenticateToken } from './authRoutes.js';

const router = express.Router();

// Create job (protected route - only recruiters)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Verify user is a recruiter
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ error: 'Only recruiters can post jobs' });
    }

    // Sanitize job title for collection name
    const sanitizedTitle = req.body.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    const collectionName = `applications_${sanitizedTitle}_${Date.now()}`;

    const jobData = {
      title: req.body.title,
      description: req.body.description,
      company: req.body.company,
      location: req.body.location,
      type: req.body.type,
      salaryMin: req.body.salaryMin ? parseInt(req.body.salaryMin) : undefined,
      salaryMax: req.body.salaryMax ? parseInt(req.body.salaryMax) : undefined,
      skills: req.body.skills || [],
      experience: req.body.experience,
      applicationDeadline: req.body.applicationDeadline ? new Date(req.body.applicationDeadline) : undefined,
      employerId: req.user.userId, // Set employerId from authenticated user
      collectionName: collectionName
    };

    // Create dynamic Mongoose model for this job's applications
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

    // Create the model with the dynamic collection name
    mongoose.model(collectionName, ApplicationSchema, collectionName);

    const job = new Job(jobData);
    await job.save();

    // write all jobs to data/jobs.json
    try {
      const jobs = await Job.find().sort({ createdAt: -1 });
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      fs.writeFileSync(path.join(dataDir, 'jobs.json'), JSON.stringify(jobs, null, 2), 'utf8');
    } catch (fileErr) {
      console.error('Failed to write jobs.json:', fileErr.message);
    }

    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve jobs.json file for employer page convenience
router.get('/file', (req, res) => {
  const filePath = path.join(process.cwd(), 'data', 'jobs.json');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.json([]);
  }
});

export default router;
