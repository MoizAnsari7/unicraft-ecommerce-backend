const express = require('express');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// POST /api/notifications - Create a new notification (admin only)
router.post('/notifications', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { userId, adminId, message, type } = req.body;
  try {
    const notification = new Notification({
      userId,
      adminId,
      message,
      type,
    });
    await notification.save();
    res.status(201).json({ message: 'Notification created successfully', notification });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error });
  }
});


// GET /api/notifications - Get all notifications for a user or admin
router.get('/notifications', authMiddleware, async (req, res) => {
    const { userId, adminId } = req.query;  // Filter by userId or adminId if provided
  
    try {
      const query = {};
      if (userId) query.userId = userId;
      if (adminId) query.adminId = adminId;
  
      const notifications = await Notification.find(query).sort({ createdAt: -1 });
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving notifications', error });
    }
  });