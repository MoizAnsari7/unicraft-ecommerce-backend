const express = require('express');

const User = require('../model/Users.model'); // Assuming User schema includes fields for role and permissions
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

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


  // PUT /api/admin/users/:userId/role - Update user role (e.g., promote to admin)
router.put('/users/:userId/role', authMiddleware, adminMiddleware, async (req, res) => {
    const { role, permissions } = req.body;
    try {
      const user = await User.findById(req.params.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      
      user.role = role ?? user.role;
      user.permissions = permissions ?? user.permissions;
      await user.save();
  
      res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user role', error });
    }
  });



// GET /api/admin/reports/sales - View sales report for a specific date range
router.get('/reports/sales', authMiddleware, adminMiddleware, async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
      // Logic to retrieve sales data within the specified date range
      const salesReport = [
        { date: '2024-10-01', totalSales: 5000 },
        { date: '2024-10-02', totalSales: 7000 }
      ];
      res.status(200).json(salesReport);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving sales report', error });
    }
  });



  // GET /api/admin/reports/inventory - View inventory levels and trends
router.get('/reports/inventory', authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const inventoryReport = [
        { productId: "1", productName: "Product A", stockLevel: 50 },
        { productId: "2", productName: "Product B", stockLevel: 20 }
      ];
      res.status(200).json(inventoryReport);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving inventory report', error });
    }
  });


  // POST /api/admin/permissions - Define new permissions or modify existing ones

  router.post('/permissions', authMiddleware, adminMiddleware, async (req, res) => {
    const { role, permissions } = req.body;
  
    if (!role || !Array.isArray(permissions)) {
      return res.status(400).json({ message: 'Invalid role or permissions data' });
    }
  
    try {
      // Assume you have a Roles collection in your DB
      const roleData = await Role.findOneAndUpdate({ role }, { permissions }, { new: true, upsert: true });
      res.status(200).json({ message: 'Permissions updated successfully', roleData });

router.post('/permissions', authMiddleware, adminMiddleware, async (req, res) => {
    const { role, permissions } = req.body;
    try {
      // Logic to create or update permissions for a role
      const updatedRole = { role, permissions };
      // Example: update permissions in database if role exists
      res.status(200).json({ message: 'Permissions updated successfully', updatedRole });

    } catch (error) {
      res.status(500).json({ message: 'Error updating permissions', error });
    }
  });



  // GET /api/admin/tasks - View and manage pending tasks
router.get('/tasks', authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const tasks = [
        { taskId: "1", description: "Check low stock for Product A", status: "pending" },
        { taskId: "2", description: "Review sales report", status: "in-progress" }
      ];
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving tasks', error });
    }
  });


  // POST /api/admin/notifications - Send notifications to specific admin layers
router.post('/notifications', authMiddleware, adminMiddleware, async (req, res) => {
    const { message, targetRoles } = req.body;
    try {
      // Logic to send notifications to admins with specified roles
      res.status(200).json({ message: 'Notifications sent successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending notifications', error });
    }
  });
  

  module.exports = router;