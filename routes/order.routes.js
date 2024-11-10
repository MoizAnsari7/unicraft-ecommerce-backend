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


  // GET /api/orders/:orderId - Get order details
router.get('/orders/:orderId', authMiddleware, async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId);
      if (!order || (req.userRole !== 'admin' && order.userId.toString() !== req.user._id)) {
        return res.status(404).json({ message: 'Order not found or access denied' });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching order details', error });
    }
  });