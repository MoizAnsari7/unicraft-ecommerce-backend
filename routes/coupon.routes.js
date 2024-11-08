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


  // PUT /api/coupons/:couponId - Update an existing coupon (admin only)
router.put('/:couponId', authMiddleware, adminMiddleware, async (req, res) => {
    const { code, discountPercentage, maxDiscountAmount, expiryDate, isActive } = req.body;
    try {
      const coupon = await Coupon.findById(req.params.couponId);
      if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
  
      coupon.code = code ?? coupon.code;
      coupon.discountPercentage = discountPercentage ?? coupon.discountPercentage;
      coupon.maxDiscountAmount = maxDiscountAmount ?? coupon.maxDiscountAmount;
      coupon.expiryDate = expiryDate ?? coupon.expiryDate;
      coupon.isActive = isActive ?? coupon.isActive;
  
      await coupon.save();
      res.status(200).json(coupon);
    } catch (error) {
      res.status(500).json({ message: 'Error updating coupon', error });
    }
  });




// DELETE /api/coupons/:couponId - Delete a coupon (admin only)
router.delete('/:couponId', authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const coupon = await Coupon.findByIdAndDelete(req.params.couponId);
      if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
  
      res.status(200).json({ message: 'Coupon deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting coupon', error });
    }
  });