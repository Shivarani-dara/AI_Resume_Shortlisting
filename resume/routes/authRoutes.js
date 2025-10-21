import express from 'express';
import jwt from 'jsonwebtoken';
import Candidate from '../models/CandidateModel.js';
import Recruiter from '../models/RecruiterModel.js';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    let existingUser;
    if (role === 'candidate') {
      existingUser = await Candidate.findOne({ email });
    } else if (role === 'recruiter') {
      existingUser = await Recruiter.findOne({ email });
    }

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    let newUser;
    if (role === 'candidate') {
      newUser = new Candidate({ name, email, password, role });
    } else if (role === 'recruiter') {
      newUser = new Recruiter({ name, email, password, role });
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user by email and role
    let user;
    if (role === 'candidate') {
      user = await Candidate.findOne({ email });
    } else if (role === 'recruiter') {
      user = await Recruiter.findOne({ email });
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

export default router;
