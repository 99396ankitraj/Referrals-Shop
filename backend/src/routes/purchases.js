import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import Product from '../models/Product.js';
import Purchase from '../models/Purchase.js';
import User from '../models/User.js';
import Referral from '../models/Referral.js';

const router = express.Router();

router.get('/mine', protect, async (req, res) => {
  const purchases = await Purchase.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(purchases);
});

router.post(
  '/',
  protect,
  [
    body('items').isArray({ min: 1 }),
    body('items.*.productId').isString(),
    body('items.*.quantity').isInt({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { items } = req.body;

    try {
      const products = await Product.find({ _id: { $in: items.map((i) => i.productId) } });
      const productMap = new Map(products.map((p) => [String(p._id), p]));

      const enriched = items.map((i) => {
        const p = productMap.get(i.productId);
        if (!p) throw new Error('Invalid product');
        return {
          product: p._id,
          name: p.name,
          price: p.price,
          quantity: i.quantity,
          imageUrl: p.imageUrl || '',
        };
      });

      const total = enriched.reduce((sum, it) => sum + it.price * it.quantity, 0);

      const purchase = await Purchase.create({ user: req.user._id, items: enriched, total });

      // First purchase crediting using atomic conditional update (no transactions required)
      if (req.user.referredBy) {
        const updated = await User.findOneAndUpdate(
          { _id: req.user._id, firstPurchaseCredited: false },
          { $set: { firstPurchaseCredited: true }, $inc: { credits: 2 } },
          { new: true }
        );

        if (updated) {
          // Only credit referrer if this was indeed the first credited purchase
          await User.findByIdAndUpdate(req.user.referredBy, { $inc: { credits: 2 } });
          await Referral.findOneAndUpdate(
            { referrer: req.user.referredBy, referred: req.user._id },
            { status: 'converted' },
            { new: true }
          );
        }
      }

      res.json({ purchase });
    } catch (err) {
      res.status(400).json({ message: err.message || 'Purchase error' });
    }
  }
);

export default router;
