const express = require('express');
const Coupon = require('../model/Coupon.model');
const authMiddleware = require('../middlewares/authMiddleware');
const Coupon = require('../models/Coupon');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// POST /api/coupons - Create a coupon (admin only)
router.post('/coupons', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  const { code, discountAmount, expirationDate, isActive } = req.body;
  try {
    const coupon = new Coupon({
      code,
      discountAmount,
      expirationDate,
      isActive,
    });
    await coupon.save();
    res.status(201).json({ message: 'Coupon created successfully', coupon });
  } catch (error) {
    res.status(500).json({ message: 'Error creating coupon', error });
  }
});

// PUT /api/coupons/:couponId - Update a coupon (admin only)
router.put('/coupons/:couponId', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  const { discountAmount, expirationDate, isActive } = req.body;
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.couponId,
      { discountAmount, expirationDate, isActive },
      { new: true }
    );
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.status(200).json({ message: 'Coupon updated successfully', coupon });
  } catch (error) {
    res.status(500).json({ message: 'Error updating coupon', error });
  }
});

// DELETE /api/coupons/:couponId - Delete a coupon (admin only)
router.delete('/coupons/:couponId', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.couponId);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting coupon', error });
  }
});

// POST /api/coupons/apply - Apply a coupon code at checkout
router.post('/coupons/apply', async (req, res) => {
  const { code, totalAmount } = req.body;
  try {
    const coupon = await Coupon.findOne({ code, isActive: true, expirationDate: { $gte: Date.now() } });
    if (!coupon) return res.status(404).json({ message: 'Invalid or expired coupon code' });

    const discount = (totalAmount * coupon.discountAmount) / 100;
    const discountedTotal = totalAmount - discount;

    res.status(200).json({ message: 'Coupon applied successfully', discountedTotal });
  } catch (error) {
    res.status(500).json({ message: 'Error applying coupon', error });
  }
});

module.exports = router;
