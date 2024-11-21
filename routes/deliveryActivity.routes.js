const express = require('express');

const DeliveryActivity = require('../model/deliveryActivity.model');
const Order = require('../model/Order.model');
const authMiddleware = require('../middlewares/authMiddleware');

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

// GET /api/delivery-activities/:orderId - Get all delivery activities for a specific order
router.get('/:orderId', authMiddleware, async (req, res) => {
  try {
    const activities = await DeliveryActivity.find({ orderId: req.params.orderId }).sort({ timestamp: 1 });
    if (!activities || activities.length === 0) {
      return res.status(404).json({ message: 'No delivery activities found for this order' });
    }

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving delivery activities', error });
  }
});

// PUT /api/delivery-activities/:activityId - Update an existing delivery activity with live location tracking
router.put('/:activityId', authMiddleware, async (req, res) => {
  const { status, location, coordinates, city } = req.body;

  try {
    const deliveryActivity = await DeliveryActivity.findByIdAndUpdate(
      req.params.activityId,
      { status, location, coordinates, city },
      { new: true }
    );

    if (!deliveryActivity) {
      return res.status(404).json({ message: 'Delivery activity not found' });
    }

    // Emit real-time update for live tracking
    req.app.io.emit('delivery-activity-updated', deliveryActivity);

    res.status(200).json({ message: 'Delivery activity updated successfully', deliveryActivity });
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery activity', error });
  }
});

// Endpoint to continuously update live location of the delivery partner
router.post('/update-location', authMiddleware, async (req, res) => {
  const { partnerId, coordinates } = req.body;

  try {
    const activity = await DeliveryActivity.findOneAndUpdate(
      { orderId: partnerId, status: "out for delivery" },
      { coordinates },
      { new: true }
    );

    if (!activity) {
      return res.status(404).json({ message: 'Active delivery activity not found for this partner' });
    }

    // Emit the updated coordinates for live tracking
    req.app.io.emit('delivery-location-updated', { partnerId, coordinates });

    res.status(200).json({ message: 'Delivery location updated in real-time' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery location', error });
  }
});

// DELETE /api/delivery-activities/:activityId - Delete a delivery activity
router.delete('/:activityId', authMiddleware, async (req, res) => {
  try {
    const deliveryActivity = await DeliveryActivity.findByIdAndDelete(req.params.activityId);
    if (!deliveryActivity) {
      return res.status(404).json({ message: 'Delivery activity not found' });
    }

    // Emit real-time update for tracking
    req.app.io.emit('delivery-activity-deleted', { activityId: req.params.activityId });

    res.status(200).json({ message: 'Delivery activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting delivery activity', error });
  }
});

module.exports = router;
