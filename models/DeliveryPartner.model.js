const mongoose = require('mongoose');

// Delivery Partner Schema (Driver)
const DeliveryPartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  activeOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Current active order assigned to the delivery partner
  createdAt: { type: Date, default: Date.now }
});


const DeliveryPartnerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    activeOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Current active order assigned to the delivery partner
    createdAt: { type: Date, default: Date.now }
  });
  
  
module.exports = mongoose.model('DeliveryPartner', DeliveryPartnerSchema);
``
