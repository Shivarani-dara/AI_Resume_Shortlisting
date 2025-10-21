import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pdfRoutes from "./routes/pdfRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import rankRoutes from "./routes/rankRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import path from "path";
import mongoose from 'mongoose';
import resumesRoutes from './routes/resumeRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow requests from React app
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public/
app.use(express.static(path.join(process.cwd(), 'public')));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/rank", rankRoutes);
app.use('/api/resumes', resumesRoutes);

// Optional: Test route to check server
app.get("/test", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Convenience routes for static pages
app.get('/employer', (req, res) => res.sendFile(path.join(process.cwd(),'public','employer.html')));
app.get('/jobs', (req, res) => res.sendFile(path.join(process.cwd(),'public','jobs.html')));
app.get('/employer/jobs', (req, res) => res.sendFile(path.join(process.cwd(),'public','employer_jobs.html')));

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
