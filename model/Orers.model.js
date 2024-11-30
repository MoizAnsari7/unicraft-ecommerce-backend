// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },  // price at the time of purchase
    },
  ],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
  },
  status: { type: String, default: 'Pending' },  // e.g., "Pending", "Shipped", "Delivered"
  trackingNumber: { type: String, default: '' },  // Used for tracking shipments
  total: { type: Number, required: true },
  paymentStatus: { type: String, default: 'Pending' },  // e.g., "Paid", "Pending", "Failed"
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
