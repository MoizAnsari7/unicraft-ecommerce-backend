const express = require('express');
const Payment = require('../models/Payment');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// POST /api/payments/create - Initiate a payment session (integrates with payment gateway)
router.post('/payments/create', authMiddleware, async (req, res) => {
  const { orderId, amount, paymentMethod } = req.body;

  try {
    const payment = new Payment({
      orderId,
      userId: req.user._id,
      amount,
      paymentMethod,
    });
    await payment.save();

    // TODO: Integrate with payment gateway here to generate payment URL or token
    const paymentUrl = `https://payment-gateway.com/pay/${payment._id}`;  // Example placeholder URL

    res.status(201).json({ message: 'Payment session created', paymentUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error initiating payment', error });
  }
});


// POST /api/payments/verify - Verify payment after completion (callback from gateway)
router.post('/payments/verify', async (req, res) => {
    const { transactionId, status } = req.body;
  
    try {
      const payment = await Payment.findOneAndUpdate(
        { transactionId },
        { status, updatedAt: Date.now() },
        { new: true }
      );
  
      if (!payment) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
  
      // Update order status if payment is successful
      if (status === 'Completed') {
        await Order.findByIdAndUpdate(payment.orderId, { paymentStatus: 'Paid', updatedAt: Date.now() });
      }
  
      res.status(200).json({ message: 'Payment verified', payment });
    } catch (error) {
      res.status(500).json({ message: 'Error verifying payment', error });
    }
  });


  // GET /api/payments/methods - Retrieve available payment methods
router.get('/payments/methods', (req, res) => {
    const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer'];
    res.status(200).json({ paymentMethods });
  });
  
  // GET /api/payments/status/:paymentId - Check payment status for a transaction
  router.get('/payments/status/:paymentId', async (req, res) => {
    try {
      const payment = await Payment.findById(req.params.paymentId);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      res.status(200).json({ status: payment.status });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving payment status', error });
    }
  });


  // POST /api/checkout - Finalize cart, confirm order, and initiate payment
router.post('/checkout', authMiddleware, async (req, res) => {
    const { items, shippingAddress, paymentMethod } = req.body;
  
    try {
      // Calculate total and validate stock, discounts, etc.
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
      // Create a new order
      const order = new Order({
        userId: req.user._id,
        items,
        shippingAddress,
        total,
      });
      await order.save();
  
      // Initiate payment process
      const payment = new Payment({
        orderId: order._id,
        userId: req.user._id,
        amount: total,
        paymentMethod,
      });
      await payment.save();
  
      // TODO: Generate payment URL or token with payment gateway
      const paymentUrl = `https://payment-gateway.com/pay/${payment._id}`;  // Example placeholder URL
  
      res.status(201).json({ message: 'Checkout successful, proceed to payment', paymentUrl });
    } catch (error) {
      res.status(500).json({ message: 'Error during checkout', error });
    }
  });
  