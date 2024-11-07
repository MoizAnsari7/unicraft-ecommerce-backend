10. Admin-Specific APIs
For managing administrative actions across the platform.

GET /api/admin/dashboard – Get an overview of key metrics (e.g., total sales, active users, etc.)
GET /api/admin/users – Get list of all users (admin only)
PUT /api/admin/users/:userId/role – Update user role (e.g., promote to admin)

10. Admin APIs
Dedicated to administrative actions, such as managing users, viewing metrics, and overseeing the platform.

Dashboard & Reports

GET /api/admin/dashboard – View platform metrics (total sales, active users, top products, etc.)
GET /api/admin/sales-report – Download or view sales report for a specific date range
GET /api/admin/inventory-report – View inventory levels and trends
User Management

GET /api/admin/users – Retrieve all users (admin only)
PUT /api/admin/users/:userId/role – Update user role, such as promoting to admin


8. Admin Dashboard and Multi-Layer Admin APIs
Allows for advanced dashboard metrics, multi-level roles, and task management for admins.

Dashboard and Reports

GET /api/admin/dashboard – Get metrics like total sales, active users, top-selling products, etc.
GET /api/admin/reports/sales – Download or view a detailed sales report
GET /api/admin/reports/inventory – Get inventory status and reorder alerts
GET /api/admin/reports/coupons – Analyze coupon usage and discount effectiveness
Admin Role and Permission Management

GET /api/admin/users – View all users (admin only)
PUT /api/admin/users/:userId/role – Update user role (e.g., promote to “Admin” or “Manager”)
POST /api/admin/permissions – Define new permissions or modify existing ones for layered access control (e.g., create “Sales Manager” role with limited access)
Admin Tasks and Notifications

GET /api/admin/tasks – View and manage pending tasks or issues (e.g., “Stock Low” notifications)
POST /api/admin/notifications – Send notifications to specific admin layers

const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Admin: Get All Users
router.get('/users', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access Denied' });
  }

  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Admin: Update Product Stock
router.put('/products/:productId/stock', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access Denied' });
  }

  const { stock } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, { stock }, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product stock'

 });
  }
});

module.exports = router;
```
