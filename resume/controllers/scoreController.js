import Resume from '../models/ResumeModel.js';
import Job from '../models/JobModel.js';
import axios from 'axios';

const GEMINI_URL = (key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;

// Helper to clean and parse JSON from Gemini response
const extractJSONFromText = (text) => {
  if (!text) return null;

  // Handle NO_JSON sentinel
  if (text.includes('<<<NO_JSON>>>')) return null;

  // Remove triple backticks ```json ... ``` or ```
  let cleaned = text.replace(/```json\s*|```/g, '').trim();

  // Remove custom markers <<<JSON>>> <<<ENDJSON>>>
  cleaned = cleaned.replace(/<<<JSON>>>/g, '').replace(/<<<ENDJSON>>>/g, '').trim();

  // Attempt to parse
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse JSON:', err.message);
    return null;
  }
};

// Main scoring function
export const scoreResumeForJob = async (resumeId, jobId) => {
  const resume = await Resume.findById(resumeId);
  const job = await Job.findById(jobId);
  if (!resume || !job) throw new Error('Missing resume or job');

  const prompt = `You are an ATS (Applicant Tracking System) evaluator. Given a job description and a candidate resume, evaluate the resume's match to the job and provide an ATS score.

JOB DESCRIPTION:
${job.description}

CANDIDATE RESUME:
${resume.text}

Return ONLY valid JSON matching this schema:
{
  "name": string|null,
  "email": string|null,
  "phone": string|null,
  "skills": [string],
  "experience": [ { company, title, start, end, bullets: [string] } ],
  "score": integer(0-100),
  "rationale": [string up to 3],
  "recommendedAction": string
}

The "score" field is mandatory and must be an integer from 0 to 100. If a field is missing use null or empty array. Do not include explanatory text outside the JSON.`;

  const axiosInstance = axios.create({ timeout: 30000 });
  const body = { contents: [{ parts: [{ text: prompt }] }] };

  try {
    const res = await axiosInstance.post(GEMINI_URL(process.env.GEMINI_API_KEY), body);
    const content = res?.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse JSON safely
    const parsed = extractJSONFromText(content);

    let score, rationale, recommendedAction;

    if (parsed && typeof parsed.score === 'number') {
      score = parsed.score;
      rationale = parsed.rationale || [];
      recommendedAction = parsed.recommendedAction || '';
    } else {
      // Fallback: simple keyword-based score
      const jobKeywords = job.description.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const uniqueKeywords = [...new Set(jobKeywords)];
      const resumeText = resume.text.toLowerCase();
      let matches = 0;
      uniqueKeywords.forEach(k => { if (resumeText.includes(k)) matches++; });
      score = Math.max(1, Math.min(100, Math.round((matches / uniqueKeywords.length) * 100)));
      rationale = ['Local keyword match score'];
      recommendedAction = 'Review based on keywords';
    }

    // Save to resume
    const scoreRecord = { jobId, score, rationale, recommendedAction };
    resume.scores = resume.scores || [];
    resume.scores.push(scoreRecord);
    await resume.save();

    return { parsed, scoreRecord };

  } catch (err) {
    console.error('Gemini scoring error:', err.message);
    console.error('Full error:', err);

    // Fallback: null score
    const scoreRecord = { jobId, score: null, rationale: ['upstream error'], recommendedAction: 'manual review' };
    resume.scores = resume.scores || [];
    resume.scores.push(scoreRecord);
    await resume.save();

    return { parsed: null, scoreRecord };
  }
};
