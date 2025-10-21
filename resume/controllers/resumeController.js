const Resume = require("../models/resume");
const pdfParse = require("pdf-parse");
const OpenAI = require("openai");
const fs = require("fs");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 🧠 Parse and Save Resume
exports.uploadResume = async (req, res) => {
  try {
    const pdfBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(pdfBuffer);

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a resume parser. Extract name, skills (as array), experience (in years), location, education, certifications, and expected budget from this text as JSON." },
        { role: "user", content: data.text }
      ]
    });

    const parsedData = JSON.parse(response.choices[0].message.content);
    parsedData.parsedText = data.text;

    const resume = new Resume(parsedData);
    await resume.save();

    res.json({ message: "Resume parsed and saved!", resume });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to parse resume" });
  }
};

// 🎯 Shortlist Candidates
exports.shortlist = async (req, res) => {
  const { skills, minExperience, location, budget } = req.body;

  const shortlisted = await Resume.find({
    skills: { $in: skills },
    experience: { $gte: minExperience },
    location: location,
    expectedBudget: { $lte: budget }
  }).sort({ experience: -1 });

  res.json(shortlisted);
};
