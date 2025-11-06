import express from 'express';
import { protect } from '../middleware/auth.js';
import Referral from '../models/Referral.js';
import User from '../models/User.js';
import Purchase from '../models/Purchase.js';

const router = express.Router();

router.get('/summary', protect, async (req, res) => {
  const userId = req.user._id;
  try {
    const totalReferred = await Referral.countDocuments({ referrer: userId });
    const converted = await Referral.countDocuments({ referrer: userId, status: 'converted' });
    const credits = (await User.findById(userId).select('credits'))?.credits || 0;
    res.json({ totalReferred, converted, credits });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/purchases', protect, async (req, res) => {
  const purchases = await Purchase.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(purchases);
});

router.get('/referral-link', protect, async (req, res) => {
  const code = req.user.referralCode;
  const username = req.user.username;
  const base = process.env.PUBLIC_APP_URL || 'http://localhost:5173';
  // Use username in the link to satisfy r=USERNAME expectation, also provide code
  const link = `${base}/register?r=${encodeURIComponent(username)}`;
  res.json({ referralCode: code, username, link });
});

export default router;
