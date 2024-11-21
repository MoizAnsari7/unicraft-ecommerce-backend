const mongoose = require("mongoose");

// Delivery Activity Schema to track each delivery step with time, location, and city
const DeliveryActivitySchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  status: { type: String, required: true }, // E.g., 'ordered', 'shipped', 'out for delivery', 'delivered'
  location: { type: String, required: true }, // Location name (e.g., 'Amazon Facility', 'Delivery Station')
  coordinates: { type: [Number], required: true }, // [latitude, longitude]
  city: { type: String, required: true }, // City where the event occurred
  timestamp: { type: Date, default: Date.now }, // Timestamp of the activity
});

module.exports = mongoose.model("DeliveryActivity", DeliveryActivitySchema);
