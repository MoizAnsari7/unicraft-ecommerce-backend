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


// POST /api/coupons - Create a new coupon (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const { code, discountPercentage, maxDiscountAmount, expiryDate, isActive } = req.body;
    try {
      const coupon = new Coupon({
        code,
        discountPercentage,
        maxDiscountAmount,
        expiryDate,
        isActive: isActive ?? true // Default to true if not specified
      });
  
      await coupon.save();
      res.status(201).json(coupon);
    } catch (error) {
      res.status(500).json({ message: 'Error creating coupon', error });
    }
  });