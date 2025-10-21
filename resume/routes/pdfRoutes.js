// backend/routes/pdfRoutes.js
import express from "express";
import { parsePDF } from "../controllers/pdfController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temporary folder to store uploaded PDFs

// POST route to upload PDF
router.post("/upload", upload.single("file"), parsePDF);

export default router;
