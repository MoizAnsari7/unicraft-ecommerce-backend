const express = require('express');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// POST /api/orders - Place a new order (Validates cart and checks stock)
router.post('/orders', authMiddleware, async (req, res) => {
  const { items, shippingAddress, total } = req.body;

  try {
    const order = new Order({
      userId: req.user._id,
      items,
      shippingAddress,
      total,
    });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error });
  }
});