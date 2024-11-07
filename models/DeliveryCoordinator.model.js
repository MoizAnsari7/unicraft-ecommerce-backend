const mongoose = require('mongoose');

// Delivery Coordinator Schema
const DeliveryCoordinatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});


// Delivery Coordinator Schema
const DeliveryCoordinatorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
  });
  
  
module.exports = mongoose.model('DeliveryCoordinator', DeliveryCoordinatorSchema);
```
