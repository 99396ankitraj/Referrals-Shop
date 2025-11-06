import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Referral from '../models/Referral.js';

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });

router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, email, password } = req.body;
    // Support referral via multiple inputs: referralCode, r (body or query), or full URL
    let referralInput = req.body.referralCode || req.body.r || req.query.r || '';
    if (typeof referralInput === 'string') {
      referralInput = referralInput.trim();
      // If a full URL was pasted (e.g., http://.../register?r=CODE), extract the last value after '='
      const maybeCode = referralInput.includes('=') ? referralInput.split('=').pop() : referralInput;
      referralInput = decodeURIComponent(maybeCode).trim();
    }

    try {
      const exists = await User.findOne({ $or: [{ email }, { username }] });
      if (exists) return res.status(400).json({ message: 'User already exists' });

      let referredByUser = null;
      if (referralInput && typeof referralInput === 'string') {
        const raw = referralInput.trim();
        const upper = raw.toUpperCase();
        // Accept either exact referralCode match (normalized) OR username (case-insensitive)
        referredByUser = await User.findOne({
          $or: [
            { referralCode: upper },
            { username: { $regex: `^${raw}$`, $options: 'i' } },
          ],
        });
        // If not found, simply proceed without referral instead of failing the request
      }

      const user = await User.create({ username, email, password, referredBy: referredByUser?._id || null });

      if (referredByUser) {
        await Referral.create({ referrer: referredByUser._id, referred: user._id, status: 'pending' });
      }

      const token = signToken(user._id);
      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          referralCode: user.referralCode,
          referredBy: user.referredBy,
          credits: user.credits,
        },
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
      const match = await user.matchPassword(password);
      if (!match) return res.status(400).json({ message: 'Invalid credentials' });

      const token = signToken(user._id);
      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          referralCode: user.referralCode,
          referredBy: user.referredBy,
          credits: user.credits,
        },
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.get('/me', async (req, res) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: 'Not authorized' });
  }
});

export default router;
