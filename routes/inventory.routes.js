const express = require('express');
const Inventory = require('../models/Inventory');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// GET /api/inventory/:productId - Get current stock level of a product
router.get('/inventory/:productId', async (req, res) => {
  try {
    const inventory = await Inventory.findOne({ productId: req.params.productId });
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found for this product' });
    }
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving inventory', error });
  }
});


// POST /api/inventory - Add or update inventory for multiple products (admin only)
router.post('/inventory', authMiddleware, async (req, res) => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
  
    const { inventories } = req.body;  // Array of inventory objects with productId, quantity, location (optional)
    try {
      const updatedInventories = await Promise.all(
        inventories.map(async (item) => {
          let inventory = await Inventory.findOneAndUpdate(
            { productId: item.productId },
            { $inc: { quantity: item.quantity }, location: item.location },
            { new: true, upsert: true }  // Upsert creates new inventory if not found
          );
          return inventory;
        })
      );
      res.status(201).json({ message: 'Inventory updated successfully', updatedInventories });
    } catch (error) {
      res.status(500).json({ message: 'Error updating inventory', error });
    }
  });



// PUT /api/inventory/:productId - Update stock for a specific product (admin only)
router.put('/inventory/:productId', authMiddleware, async (req, res) => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
  
    const { quantity, location } = req.body;
    try {
      const inventory = await Inventory.findOneAndUpdate(
        { productId: req.params.productId },
        { quantity, location },
        { new: true }
      );
      if (!inventory) {
        return res.status(404).json({ message: 'Inventory not found for this product' });
      }
      res.status(200).json({ message: 'Inventory updated successfully', inventory });
    } catch (error) {
      res.status(500).json({ message: 'Error updating inventory', error });
    }
  });
  
  module.exports = router;