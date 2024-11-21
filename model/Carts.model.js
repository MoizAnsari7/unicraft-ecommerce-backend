const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const CartSchema = new mongoose.Schema({
  _id: { type: ObjectId, auto: true },
  userId: { type: ObjectId, ref: 'User', required: true }, // Reference to User ID
  items: [
    {
      productId: { type: ObjectId, ref: 'Product', required: true }, // Reference to Product ID
      quantity: { type: Number, required: true },
      savedForLater: { type: Boolean, default: false } // Flag for "saved for later"
    }
  ],
  total: { type: Number, required: true, default: 0 },
  appliedCoupon: { type: ObjectId, ref: 'Coupon' }, // Reference to Coupon ID, if applied
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Automatically update 'updatedAt' on save
CartSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Cart', CartSchema);
