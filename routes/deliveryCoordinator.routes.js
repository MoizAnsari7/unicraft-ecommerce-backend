const express = require('express');
const DeliveryCoordinator = require('../models/DeliveryCoordinator');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Create a new delivery coordinator
router.post('/', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access Denied' });
  }

  const { name, email } = req.body;
  try {
    const coordinator = new DeliveryCoordinator({ name, email });
    await coordinator.save();
    res.status(201).json({ message: 'Delivery coordinator created', coordinator });
  } catch (error) {
    res.status(500).json({ message: 'Error creating coordinator', error });
  }
});


// Get all delivery coordinators
router.get('/', authMiddleware, async (req, res) => {
    try {
      const coordinators = await DeliveryCoordinator.find();
      res.status(200).json(coordinators);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching coordinators', error });
    }
  });