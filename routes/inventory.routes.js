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