import fs from "fs";
import path from "path";
import pdf from "./pdfParseWrapper.js";
import axios from "axios";
import ResumeModel from "../models/ResumeModel.js";
import JobModel from "../models/JobModel.js";
import ApplicationModel from "../models/ApplicationModel.js";
import { scoreResumeForJob } from "./scoreController.js";

// Helper functions
const extractEmail = (text) => {
  const match = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
  return match ? match[0] : null;
};

const extractPhone = (text) => {
  const match = text.match(/(\+?\d{1,3}[\-\.\s]?)?(\(?\d{2,4}\)?[\-\.\s]?)?\d{3,4}[\-\.\s]?\d{3,4}/);
  return match ? match[0].trim() : null;
};

const extractName = (text) => {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const ignoreKeywords = [/summary/i, /skills?/i, /experience/i, /education/i, /certificat/i, /contact/i, /phone/i, /email/i];
  for (const line of lines) {
    if (line.length > 2 && line.length < 60 && /[A-Za-z]/.test(line)) {
      if (ignoreKeywords.some(rx => rx.test(line))) continue;
      if (line.includes('@')) continue;
      const digits = (line.match(/\d/g) || []).length;
      if (digits > line.length * 0.4) continue;
      return line;
    }
  }
  return null;
};

// 📄 Parse PDF & Save Resume + Auto-score
export const parsePDF = async (req, res) => {
  try {
    const jobId = req.query?.jobId || req.body?.jobId;
    let job = null;
    if (jobId) {
      try { job = await JobModel.findById(jobId); } catch (e) { job = null; }
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const filePath = path.resolve(process.cwd(), req.file.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Uploaded PDF file not found" });
    }

    // Read and parse PDF
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    const text = pdfData.text || "";

    // Extract basic fields heuristically
    const extracted = {
      name: extractName(text),
      email: extractEmail(text),
      phone: extractPhone(text),
      summarySection: text.split(/\r?\n/).slice(0, 10).join(" ") // first few lines
    };

    // Save resume first
    const resumeDoc = new ResumeModel({
      filename: path.basename(filePath),
      path: filePath,
      extracted,
      text,
      scores: []
    });
    await resumeDoc.save();

    // ✅ Auto-score if jobId is provided and create application
    let scoreResult = null;
    let application = null;
    if (jobId) {
      try {
        scoreResult = await scoreResumeForJob(resumeDoc._id, jobId);
        // Create application record
        application = new ApplicationModel({
          jobId,
          resumeId: resumeDoc._id,
          atsScore: scoreResult?.scoreRecord?.score,
          rationale: scoreResult?.scoreRecord?.rationale,
          recommendedAction: scoreResult?.scoreRecord?.recommendedAction
        });
        await application.save();
      } catch (err) {
        console.error("ATS scoring or application creation failed:", err.message);
      }
    }

    res.json({
      message: "Resume uploaded and parsed successfully",
      resumeId: resumeDoc._id,
      applicationId: application?._id,
      extracted,
      atsScore: scoreResult?.scoreRecord || null
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to parse PDF" });
  }
};
