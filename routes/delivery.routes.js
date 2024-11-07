const express = require('express');
const DeliveryPartner = require('../models/DeliveryPartner');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Deliveries can be updated with real-time coordinates (latitude, longitude)

// Endpoint to assign a delivery partner to an order
router.post('/assign/:orderId', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access Denied' });
  }

  const { partnerId } = req.body;
  try {
    const order = await Order.findById(req.params.orderId);
    const deliveryPartner = await DeliveryPartner.findById(partnerId);
    
    if (!order || !deliveryPartner) {
      return res.status(404).json({ message: 'Order or Delivery Partner not found' });
    }

    // Assign order to the delivery partner
    deliveryPartner.activeOrder = order._id;
    await deliveryPartner.save();

    order.status = 'dispatched';  // Mark order as dispatched
    await order.save();

    res.status(200).json({ message: 'Order assigned to delivery partner successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning delivery partner', error });
  }
});

// Endpoint to update delivery partner's live location (coordinates)
router.post('/update-location', authMiddleware, async (req, res) => {
  const { latitude, longitude, partnerId } = req.body;

  try {
    const deliveryPartner = await DeliveryPartner.findById(partnerId);
    if (!deliveryPartner) {
      return res.status(404).json({ message: 'Delivery Partner not found' });
    }

    // Emit the updated coordinates to the delivery tracker using socket.io
    const data = {
      partnerId,
      latitude,
      longitude,
    };

    // Emit to the specific delivery coordinator's tracking socket (we will do this on the front end using Socket.io)
    req.app.io.emit('delivery-updated', data);

    res.status(200).json({ message: 'Delivery location updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery location', error });
  }
});

module.exports = router;
```

const express = require('express');
const DeliveryPartner = require('../models/DeliveryPartner');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Deliveries can be updated with real-time coordinates (latitude, longitude)

// Endpoint to assign a delivery partner to an order
router.post('/assign/:orderId', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access Denied' });
  }

  const { partnerId } = req.body;
  try {
    const order = await Order.findById(req.params.orderId);
    const deliveryPartner = await DeliveryPartner.findById(partnerId);
    
    if (!order || !deliveryPartner) {
      return res.status(404).json({ message: 'Order or Delivery Partner not found' });
    }

    // Assign order to the delivery partner
    deliveryPartner.activeOrder = order._id;
    await deliveryPartner.save();

    order.status = 'dispatched';  // Mark order as dispatched
    await order.save();

    res.status(200).json({ message: 'Order assigned to delivery partner successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning delivery partner', error });
  }
});

// Endpoint to update delivery partner's live location (coordinates)
router.post('/update-location', authMiddleware, async (req, res) => {
  const { latitude, longitude, partnerId } = req.body;

  try {
    const deliveryPartner = await DeliveryPartner.findById(partnerId);
    if (!deliveryPartner) {
      return res.status(404).json({ message: 'Delivery Partner not found' });
    }

    // Emit the updated coordinates to the delivery tracker using socket.io
    const data = {
      partnerId,
      latitude,
      longitude,
    };

    // Emit to the specific delivery coordinator's tracking socket (we will do this on the front end using Socket.io)
    req.app.io.emit('delivery-updated', data);

    res.status(200).json({ message: 'Delivery location updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery location', error });
  }
});

module.exports = router;


const express = require('express');
const Order = require('../models/Order');
const DeliveryPartner = require('../models/DeliveryPartner');
const DeliveryActivity = require('../models/DeliveryActivity');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Endpoint to assign a delivery partner to an order
router.post('/assign/:orderId', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access Denied' });
  }

  const { partnerId } = req.body;
  try {
    const order = await Order.findById(req.params.orderId);
    const deliveryPartner = await DeliveryPartner.findById(partnerId);
    
    if (!order || !deliveryPartner) {
      return res.status(404).json({ message: 'Order or Delivery Partner not found' });
    }

    // Assign order to the delivery partner
    deliveryPartner.activeOrder = order._id;
    await deliveryPartner.save();

    order.status = 'shipped';  // Mark order as shipped
    await order.save();

    // Log the 'shipped' activity
    const shippedActivity = new DeliveryActivity({
      orderId: order._id,
      status: 'shipped',
      location: 'Amazon Facility',  // Example location
      coordinates: [37.7749, -122.4194],  // Example coordinates (latitude, longitude)
    });
    await shippedActivity.save();

    res.status(200).json({ message: 'Order assigned to delivery partner successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning delivery partner', error });
  }
});

// Endpoint to update delivery partner's live location and status
router.post('/update-location', authMiddleware, async (req, res) => {
  const { latitude, longitude, partnerId, status, location } = req.body;

  try {
    const deliveryPartner = await DeliveryPartner.findById(partnerId);
    if (!deliveryPartner) {
      return res.status(404).json({ message: 'Delivery Partner not found' });
    }

    // Save the current delivery activity with updated status
    const deliveryActivity = new DeliveryActivity({
      orderId: deliveryPartner.activeOrder,  // Use active order assigned to the partner
      status,  // E.g., 'out for delivery', 'delivered'
      location,
      coordinates: [latitude, longitude],
    });
    await deliveryActivity.save();

    // Emit updated location and status to front end via Socket.io
    const data = {
      partnerId,
      latitude,
      longitude,
      status,
      location,
    };
    req.app.io.emit('delivery-updated', data);  // Emit to all clients or specific ones

    res.status(200).json({ message: 'Delivery location updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery location', error });
  }
});

// Endpoint to get the full delivery activity history for an order
router.get('/activity/:orderId', authMiddleware, async (req, res) => {
  try {
    const activities = await DeliveryActivity.find({ orderId: req.params.orderId }).sort({ timestamp: 1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching delivery activities', error });
  }
});

module.exports = router;

const express = require('express');
const Order = require('../models/Order');
const DeliveryPartner = require('../models/DeliveryPartner');
const DeliveryActivity = require('../models/DeliveryActivity');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Endpoint to assign a delivery partner to an order
router.post('/assign/:orderId', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access Denied' });
  }

  const { partnerId } = req.body;
  try {
    const order = await Order.findById(req.params.orderId);
    const deliveryPartner = await DeliveryPartner.findById(partnerId);
    
    if (!order || !deliveryPartner) {
      return res.status(404).json({ message: 'Order or Delivery Partner not found' });
    }

    // Assign order to the delivery partner
    deliveryPartner.activeOrder = order._id;
    await deliveryPartner.save();

    order.status = 'shipped';  // Mark order as shipped
    await order.save();

    // Log the 'shipped' activity with city name
    const shippedActivity = new DeliveryActivity({
      orderId: order._id,
      status: 'shipped',
      location: 'Amazon Facility',  // Example location
      coordinates: [37.7749, -122.4194],  // Example coordinates (latitude, longitude)
      city: 'San Francisco',  // Example city
    });
    await shippedActivity.save();

    res.status(200).json({ message: 'Order assigned to delivery partner successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning delivery partner', error });
  }
});

// Endpoint to update delivery partner's live location and status
router.post('/update-location', authMiddleware, async (req, res) => {
  const { latitude, longitude, partnerId, status, location, city } = req.body;

  try {
    const deliveryPartner = await DeliveryPartner.findById(partnerId);
    if (!deliveryPartner) {
      return res.status(404).json({ message: 'Delivery Partner not found' });
    }

    // Save the current delivery activity with updated status and city
    const deliveryActivity = new DeliveryActivity({
      orderId: deliveryPartner.activeOrder,  // Use active order assigned to the partner
      status,  // E.g., 'out for delivery', 'delivered'
      location,
      coordinates: [latitude, longitude],
      city,  // City where the activity happened
    });
    await deliveryActivity.save();

    // Emit updated location and status to front end via Socket.io
    const data = {
      partnerId,
      latitude,
      longitude,
      status,
      location,
      city,  // City added to the live update
    };
    req.app.io.emit('delivery-updated', data);  // Emit to all clients or specific ones

    res.status(200).json({ message: 'Delivery location updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery location', error });
  }
});

// Endpoint to get the full delivery activity history for an order
router.get('/activity/:orderId', authMiddleware, async (req, res) => {
  try {
    const activities = await DeliveryActivity.find({ orderId: req.params.orderId }).sort({ timestamp: 1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching delivery activities', error });
  }
});

module.exports = router;
