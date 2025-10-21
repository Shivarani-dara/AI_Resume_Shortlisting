
import express from 'express';
import Application from '../models/ApplicationModel.js';
import Resume from '../models/ResumeModel.js';
import Job from '../models/JobModel.js';
import { authenticateToken } from './authRoutes.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pdfParse from '../controllers/pdfParseWrapper.js';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'resumes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const router = express.Router();

// Apply for a job with resume upload and AI parsing
router.post('/upload', authenticateToken, upload.single('resume'), async (req, res) => {
  try {
    const { jobId } = req.body;
    const candidateId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    // Check if application already exists
    const existingApplication = await Application.findOne({
      jobId,
      candidateId
    });

    if (existingApplication) {
      // Delete uploaded file if application already exists
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Already applied for this job' });
    }

    // Parse resume using pdf-parse and Gemini AI
    const pdfPath = req.file.path;
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    Analyze this resume text and extract the following information in JSON format:
    - name: Full name of the candidate
    - email: Email address
    - phone: Phone number
    - skills: Array of technical skills (extract from skills section or mentioned throughout)
    - experience: Years of experience (number, estimate if not explicitly stated)
    - education: Highest education level
    - location: Current location/city

    Resume text:
    ${resumeText}

    Return only valid JSON without any additional text or formatting.
    `;

    let extractedData;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean the response to get valid JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      extractedData = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch (geminiError) {
      console.error('Error with Gemini API:', geminiError);
      // Fallback to basic extraction or default data
      extractedData = {
        name: 'Unknown',
        email: '',
        phone: '',
        skills: [],
        experience: 0,
        education: 'Not specified',
        location: 'Not specified'
      };
    }

    // Create resume record
    const resume = new Resume({
      filename: req.file.originalname,
      filepath: req.file.path,
      extracted: extractedData,
      candidateId
    });
    await resume.save();

    // Calculate ATS score based on job requirements
    let atsScore = 0;
    const maxScore = 100;

    // Get the job-specific collection name
    const jobDoc = await Job.findById(jobId);
    if (!jobDoc) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Job not found' });
    }

    // Skills matching (40% weight)
    const jobSkills = jobDoc.skills || [];
    const candidateSkills = extractedData.skills || [];
    const skillMatches = jobSkills.filter(skill =>
      candidateSkills.some(candidateSkill =>
        candidateSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(candidateSkill.toLowerCase())
      )
    );
    const skillScore = (skillMatches.length / Math.max(jobSkills.length, 1)) * 40;
    atsScore += skillScore;

    // Experience matching (30% weight)
    const requiredExperience = jobDoc.experience === 'entry' ? 0 :
                              jobDoc.experience === 'mid' ? 2 :
                              jobDoc.experience === 'senior' ? 5 : 8;
    const candidateExperience = extractedData.experience || 0;
    const experienceScore = Math.min(candidateExperience / Math.max(requiredExperience + 2, 1), 1) * 30;
    atsScore += experienceScore;

    // Location matching (10% weight)
    const jobLocation = jobDoc.location?.toLowerCase() || '';
    const candidateLocation = extractedData.location?.toLowerCase() || '';
    const locationMatch = jobLocation && candidateLocation &&
                         (jobLocation.includes(candidateLocation) || candidateLocation.includes(jobLocation));
    atsScore += locationMatch ? 10 : 0;

    // Education bonus (10% weight)
    const hasRelevantEducation = extractedData.education &&
                                (extractedData.education.toLowerCase().includes('bachelor') ||
                                 extractedData.education.toLowerCase().includes('master') ||
                                 extractedData.education.toLowerCase().includes('phd'));
    atsScore += hasRelevantEducation ? 10 : 0;

    // Keyword matching in resume content (10% weight)
    const jobKeywords = [jobDoc.title, ...(jobDoc.description ? [jobDoc.description] : []), ...(jobDoc.requirements ? [jobDoc.requirements] : [])]
                       .join(' ').toLowerCase().split(/\s+/);
    const resumeContent = `${extractedData.name} ${extractedData.skills?.join(' ')} ${extractedData.education}`.toLowerCase();
    const keywordMatches = jobKeywords.filter(keyword =>
      keyword.length > 2 && resumeContent.includes(keyword)
    );
    const keywordScore = (keywordMatches.length / Math.max(jobKeywords.length, 1)) * 10;
    atsScore += keywordScore;

    atsScore = Math.round(Math.min(atsScore, maxScore));

    // Create application record in job-specific collection
    const ApplicationModel = mongoose.model(jobDoc.collectionName);
    const application = new ApplicationModel({
      jobId,
      resumeId: resume._id,
      candidateId,
      atsScore,
      rationale: [
        `Skills match: ${skillMatches.length}/${jobSkills.length} (${Math.round(skillScore)}%)`,
        `Experience: ${candidateExperience} years (${Math.round(experienceScore)}%)`,
        `Location: ${locationMatch ? 'Match' : 'No match'} (${locationMatch ? 10 : 0}%)`,
        `Education: ${hasRelevantEducation ? 'Relevant' : 'Not specified'} (${hasRelevantEducation ? 10 : 0}%)`,
        `Keywords: ${keywordMatches.length} matches (${Math.round(keywordScore)}%)`
      ],
      recommendedAction: atsScore >= 80 ? 'Strong candidate - recommend interview' :
                        atsScore >= 60 ? 'Good candidate - consider for shortlist' :
                        atsScore >= 40 ? 'Moderate match - review manually' :
                        'Low match - may not be suitable'
    });

    await application.save();

    res.json({
      message: 'Application submitted successfully',
      atsScore,
      application: application,
      extractedData
    });
  } catch (err) {
    console.error('Error in application upload:', err);
    // Clean up uploaded file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: err.message });
  }
});

// Apply for a job
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { jobId, resumeId } = req.body;
    const candidateId = req.user.userId;

    // Get the job-specific collection name
    const jobDoc = await Job.findById(jobId);
    if (!jobDoc) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if application already exists in job-specific collection
    const ApplicationModel = mongoose.model(jobDoc.collectionName);
    const existingApplication = await ApplicationModel.findOne({
      jobId,
      resumeId
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied for this job' });
    }

    // Create new application in job-specific collection
    const application = new ApplicationModel({
      jobId,
      resumeId,
      candidateId, // Add candidateId for tracking
      atsScore: 0, // Default score for manual applications
      rationale: ['Manual application'],
      recommendedAction: 'Review manually'
    });

    await application.save();

    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get applications for a specific job (for recruiters) - sorted by ATS score
router.get('/job/:jobId', authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;

    // Get the job-specific collection name
    const jobDoc = await Job.findById(jobId);
    if (!jobDoc) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Query the job-specific collection
    const ApplicationModel = mongoose.model(jobDoc.collectionName);
    const applications = await ApplicationModel.find({ jobId })
      .populate('resumeId')
      .populate('candidateId')
      .sort({ atsScore: -1, appliedAt: -1 }); // Sort by ATS score descending, then by application date

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get applications by candidate
router.get('/candidate', authenticateToken, async (req, res) => {
  try {
    const candidateId = req.user.userId;

    const applications = await Application.find({ candidateId })
      .populate('jobId')
      .populate('resumeId')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update application status (for recruiters)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find the job to get the collection name
    const jobDoc = await Job.findOne({ collectionName: { $regex: new RegExp(`applications_.*_${id}`) } });
    if (!jobDoc) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const ApplicationModel = mongoose.model(jobDoc.collectionName);
    const application = await ApplicationModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
