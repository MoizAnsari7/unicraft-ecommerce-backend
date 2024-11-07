Order APIs
Handles order placement, status tracking, and history.

POST /api/orders – Place a new order
GET /api/orders – Get list of orders (admin only)
GET /api/orders/:orderId – Get order details
PUT /api/orders/:orderId/status – Update order status (admin only)
DELETE /api/orders/:orderId – Cancel order (depending on the status)



5. Order APIs
Manage order creation, tracking, and status updates.

Order Processing

POST /api/orders – Place a new order (requires cart validation and stock check)
GET /api/orders – Retrieve list of orders for admin and users (admin access shows all, while users see only their orders)
GET /api/orders/:orderId – Retrieve details of a specific order, including items, status, and payment
Order Tracking and Status Updates

PUT /api/orders/:orderId/status – Update the order status (admin only)
GET /api/orders/track/:trackingNumber – Track the shipping status using a tracking number


6. Order and Delivery Tracking APIs
Manages orders, shipment, and delivery tracking.

Order Management

POST /api/orders – Place a new order (validates cart, checks stock)
GET /api/orders/:orderId – Retrieve specific order details
DELETE /api/orders/:orderId – Cancel an order if it’s in the allowed status
Delivery and Tracking

POST /api/orders/track/:orderId – Initiate order tracking for a specific order (integrates with shipment tracking service)
GET /api/orders/:orderId/tracking – Check the delivery status using tracking details
PUT /api/orders/:orderId/status – Update order status (admin only)

const express = require('express');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Create New Order
router.post('/', authMiddleware, async (req, res) => {
  const { products, totalAmount, shippingAddress } = req.body;
  try {
    const newOrder = new Order({
      userId: req.userId,
      products,
      totalAmount,
      shippingAddress,
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error placing order' });
  }
});

// Get Order Details by ID
router.get('/:orderId', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details' });
  }
});

module.exports = router;
```
