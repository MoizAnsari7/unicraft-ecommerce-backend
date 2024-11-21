const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },  // Optional reference to a User
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false },  // Optional reference to an Admin
  message: { type: String, required: true },
  type: { type: String, required: true },  // e.g., "Order Update", "Inventory Alert"
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', NotificationSchema);