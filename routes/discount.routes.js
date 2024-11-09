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
