import express from "express";
import Resume from "../models/ResumeModel.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// GET /api/resumes - list recent resumes (sanitized)
router.get("/", async (req, res) => {
  try {
    const docs = await Resume.find().sort({ createdAt: -1 }).limit(50).select("filename extracted scores createdAt");
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/resumes/:id - single resume details
router.get("/:id", async (req, res) => {
  try {
    const doc = await Resume.findById(req.params.id).select("-rawModelOutputs");
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/resumes/:id/download - download the stored file
router.get("/:id/download", async (req, res) => {
  try {
    const doc = await Resume.findById(req.params.id).select("path filename");
    if (!doc) return res.status(404).json({ error: "Not found" });
    const filePath = doc.path;
    if (!filePath || !fs.existsSync(filePath)) return res.status(404).json({ error: "File not found on server" });
    res.download(filePath, doc.filename);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
