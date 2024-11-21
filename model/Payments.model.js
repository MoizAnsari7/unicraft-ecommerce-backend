
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, // e.g., "Completed", "Pending", "Failed"
  paymentMethod: { type: String, required: true }, // e.g., "Credit Card", "PayPal"
  transactionId: { type: String, unique: true }, // Payment gateway transaction ID
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', PaymentSchema);
