const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  profilePicture: { type: String, default: '' },

  // User role
  role: {
    type: String,
    enum: ['user', 'admin', 'Customer'],
    default: 'Customer',
  },

  // Address list
  addresses: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
      phone: String,
      default: { type: Boolean, default: false }
    }
  ],

  // Order history
  orderHistory: [{ orderId: mongoose.Schema.Types.ObjectId }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
