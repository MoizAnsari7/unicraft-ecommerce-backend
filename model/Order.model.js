// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      
    },
  ],
  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
  },
  status: { type: String, default: 'Pending' },  // e.g., "Pending", "Shipped", "Delivered"
  trackingNumber: { type: String, default: '' },  // Used for tracking shipments
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: '' },
  paymentStatus: { type: String, default: 'Pending' },  // e.g., "Paid", "Pending", "Failed"
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
