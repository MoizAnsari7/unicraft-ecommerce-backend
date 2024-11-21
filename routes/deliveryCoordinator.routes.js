const express = require('express');
const DeliveryCoordinator = require('../model/DeliveryCoordinator.model');
const authMiddleware = require('../middlewares/authMiddleware');
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


  // Update a delivery coordinator
router.put('/:id', authMiddleware, async (req, res) => {
    const { name, email } = req.body;
  
    try {
      const coordinator = await DeliveryCoordinator.findByIdAndUpdate(
        req.params.id,
        { name, email },
        { new: true }
      );
  
      if (!coordinator) {
        return res.status(404).json({ message: 'Coordinator not found' });
      }
  
      res.status(200).json({ message: 'Coordinator updated', coordinator });
    } catch (error) {
      res.status(500).json({ message: 'Error updating coordinator', error });
    }
  });

  // Delete a delivery coordinator
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const coordinator = await DeliveryCoordinator.findByIdAndDelete(req.params.id);
      if (!coordinator) {
        return res.status(404).json({ message: 'Coordinator not found' });
      }
      res.status(200).json({ message: 'Coordinator deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting coordinator', error });
    }
  });
  
  module.exports = router;