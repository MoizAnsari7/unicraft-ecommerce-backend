const express = require('express');
const Coupon = require('../models/Coupon');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin'); // Middleware for admin authorization
const router = express.Router();

// GET /api/coupons - Retrieve all active coupons
router.get('/', authMiddleware, async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true, expiryDate: { $gte: new Date() } });
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving coupons', error });
  }
});