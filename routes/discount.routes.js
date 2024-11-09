const express = require('express');
const Discount = require('../models/Discount');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// POST /api/discounts - Create a new discount (admin only)
router.post('/discounts', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  const { productId, categoryId, discountPercentage, startDate, endDate, isActive } = req.body;
  try {
    const discount = new Discount({
      productId,
      categoryId,
      discountPercentage,
      startDate,
      endDate,
      isActive,
    });
    await discount.save();
    res.status(201).json({ message: 'Discount created successfully', discount });
  } catch (error) {
    res.status(500).json({ message: 'Error creating discount', error });
  }
});


// PUT /api/discounts/:discountId - Update a discount (admin only)
router.put('/discounts/:discountId', authMiddleware, async (req, res) => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { discountPercentage, startDate, endDate, isActive } = req.body;
    try {
      const discount = await Discount.findByIdAndUpdate(
        req.params.discountId,
        { discountPercentage, startDate, endDate, isActive },
        { new: true }
      );
      if (!discount) return res.status(404).json({ message: 'Discount not found' });
      res.status(200).json({ message: 'Discount updated successfully', discount });
    } catch (error) {
      res.status(500).json({ message: 'Error updating discount', error });
    }
  });