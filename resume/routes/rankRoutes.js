import express from 'express';
import Resume from '../models/ResumeModel.js';
import Job from '../models/JobModel.js';
import Application from '../models/ApplicationModel.js';
import { scoreResumeForJob } from '../controllers/scoreController.js';

const router = express.Router();

// POST /api/rank - body: { jobId, resumeIds? }
router.post('/', async (req, res) => {
  try {
    const { jobId, resumeIds } = req.body;
    if (!jobId) return res.status(400).json({ error: 'jobId required' });

    // Get the job-specific collection name
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Get applications for this job from job-specific collection
    const ApplicationModel = mongoose.model(job.collectionName);
    const applications = await ApplicationModel.find({ jobId }).populate('resumeId').sort({ atsScore: -1 });

    // If no applications, return empty
    if (applications.length === 0) {
      return res.json([]);
    }

    // Return top 5 applications with resume details
    const topApplications = applications.slice(0, 5).map(app => ({
      applicationId: app._id,
      resumeId: app.resumeId._id,
      filename: app.resumeId.filename,
      score: app.atsScore,
      rationale: app.rationale,
      recommendedAction: app.recommendedAction,
      status: app.status,
      appliedAt: app.appliedAt,
      extracted: app.resumeId.extracted
    }));

    res.json(topApplications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/rank/:jobId - get all applications for a job
router.get('/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;

    // Get the job-specific collection name
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Get applications for this job from job-specific collection
    const ApplicationModel = mongoose.model(job.collectionName);
    const applications = await ApplicationModel.find({ jobId })
      .populate('resumeId')
      .sort({ atsScore: -1 });

    const result = applications.map(app => ({
      applicationId: app._id,
      resumeId: app.resumeId._id,
      filename: app.resumeId.filename,
      score: app.atsScore,
      rationale: app.rationale,
      recommendedAction: app.recommendedAction,
      status: app.status,
      appliedAt: app.appliedAt,
      extracted: app.resumeId.extracted
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
