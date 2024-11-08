const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const CouponSchema = new mongoose.Schema({
  _id: { type: ObjectId, auto: true },
  code: { type: String, required: true, unique: true }, // e.g., "WELCOME10"
  discountPercentage: { type: Number, required: true }, // Percentage discount
  maxDiscountAmount: { type: Number, required: true }, // Max discount allowed
  expiryDate: { type: Date, required: true }, // Expiration date for coupon
  isActive: { type: Boolean, default: true }, // Coupon availability status
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Automatically update 'updatedAt' on save
CouponSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Coupon', CouponSchema);
