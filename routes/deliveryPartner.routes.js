const express = require('express');
const DeliveryPartner = require('../models/DeliveryPartner');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Create a new delivery partner
router.post('/', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access Denied' });
  }

  const { name, email, phone } = req.body;
  try {
    const partner = new DeliveryPartner({ name, email, phone });
    await partner.save();
    res.status(201).json({ message: 'Delivery partner created', partner });
  } catch (error) {
    res.status(500).json({ message: 'Error creating partner', error });
  }
});


// Get all delivery partners
router.get('/', authMiddleware, async (req, res) => {
    try {
      const partners = await DeliveryPartner.find();
      res.status(200).json(partners);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching partners', error });
    }
  });


  // Update a delivery partner
router.put('/:id', authMiddleware, async (req, res) => {
    const { name, email, phone, activeOrder } = req.body;
  
    try {
      const partner = await DeliveryPartner.findByIdAndUpdate(
        req.params.id,
        { name, email, phone, activeOrder },
        { new: true }
      );
  
      if (!partner) {
        return res.status(404).json({ message: 'Partner not found' });
      }
  
      res.status(200).json({ message: 'Partner updated', partner });
    } catch (error) {
      res.status(500).json({ message: 'Error updating partner', error });
    }
  });
  