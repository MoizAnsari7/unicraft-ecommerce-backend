const express = require('express');
const Coupon = require('../model/Coupon.model');
const authMiddleware = require('../middlewares/authMiddleware');
const Coupon = require('../models/Coupon');
const authMiddleware = require('../middleware/auth');
const router = express.Router();


//GET Coupon API
router.get('/', authMiddleware, async(req,res)=>{
  const coupon =await Coupon.find();
  if(coupon.length > 0){
    return res.status(200).json({message : "Coupon found", coupon})
  }
})


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

    // Check if the coupon already exists
    const couponExists = await Coupon.findOne({ code: code }); // Use `await` and `findOne`
    if (couponExists) {
      return res.status(400).json({ message: 'Coupon already exists' });
    } 
    await coupon.save();
    res.status(201).json({ message: 'Coupon created successfully', coupon });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: 'Error creating coupon', error });
  }
});

// PUT /api/coupons/:couponId - Update a coupon (admin only)
router.put('/coupons/:couponId', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  const {code, discountAmount, expirationDate, isActive } = req.body;
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.couponId,
      { code,discountAmount, expirationDate, isActive },
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



router.post('/apply', authMiddleware, async (req, res) => {
  const { code, totalAmount } = req.body;

  try {
    // Validate input
    if (!code || !totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Find the coupon
    const coupon = await Coupon.findOne({
      code,
      isActive: true,
      expirationDate: { $gte: new Date() }, // Ensure the coupon is not expired
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon code' });
    }

    // Check if the coupon has already been used by the user
    if (coupon.usedBy.includes(req.userId)) {
      return res.status(400).json({ message: 'Coupon has already been applied' });
    }

    // Calculate the discount (fixed discount amount)
    const discount = coupon.discountAmount;

    // Ensure discounted total is not negative
    const discountedTotal = Math.max(totalAmount - discount, 0);

    // Mark the coupon as used by the current user
    coupon.usedBy.push(req.userId);
    await coupon.save();

    res.status(200).json({
      message: 'Coupon applied successfully',
      discount,
      discountedTotal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error applying coupon', error });
  }
});





module.exports = router;
