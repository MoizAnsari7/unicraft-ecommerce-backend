const express = require('express');
const User = require('../models/User'); // Assuming User schema includes fields for role and permissions
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

// GET /api/admin/dashboard - Get an overview of key metrics
router.get('/dashboard', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Example: Retrieve metrics (replace with actual data fetching logic)
    const metrics = {
      totalSales: 100000, 
      activeUsers: 2500,
      topProducts: [
        { productId: "1", name: "Product A", sales: 5000 },
        { productId: "2", name: "Product B", sales: 4000 }
      ]
    };
    res.status(200).json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving dashboard metrics', error });
  }
});


// GET /api/admin/users - Retrieve all users (admin only)
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving users', error });
    }
  });