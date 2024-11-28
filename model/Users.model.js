const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },

  profilePicture: { type: String, default: '' },


  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'admin',
  },

  addresses: [ 

  role: { type: String, default: 'Customer' },

  addresses: [

    {
      _id: mongoose.Schema.Types.ObjectId,
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
      phone: String,
      default: { type: Boolean, default: false }
    }
  ],
  orderHistory: [{ orderId: mongoose.Schema.Types.ObjectId }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
