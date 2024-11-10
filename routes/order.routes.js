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


// GET /api/orders - Get list of orders (admin sees all, user sees only their orders)
router.get('/orders', authMiddleware, async (req, res) => {
    const query = req.userRole === 'admin' ? {} : { userId: req.user._id };
  
    try {
      const orders = await Order.find(query).sort({ createdAt: -1 });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders', error });
    }
  });