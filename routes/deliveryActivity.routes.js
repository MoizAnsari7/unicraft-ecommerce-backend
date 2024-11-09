const express = require('express');
const DeliveryActivity = require('../models/DeliveryActivity');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// POST /api/delivery-activities/:orderId - Add a new delivery activity for a specific order
router.post('/:orderId', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin' && req.userRole !== 'deliveryPartner') {
    return res.status(403).json({ message: 'Access Denied' });
  }

  const { status, location, coordinates, city } = req.body;
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const deliveryActivity = new DeliveryActivity({
      orderId: order._id,
      status,
      location,
      coordinates,
      city,
    });
    await deliveryActivity.save();

    // Emit real-time update for tracking
    req.app.io.emit('delivery-activity-created', deliveryActivity);

    res.status(201).json({ message: 'Delivery activity added successfully', deliveryActivity });
  } catch (error) {
    res.status(500).json({ message: 'Error creating delivery activity', error });
  }
});