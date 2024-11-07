const mongoose = require('mongoose');

// Order Schema for MongoDB
const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

{ "_id": "ObjectId", "userId": "ObjectId", "products": [{"productId": "ObjectId", "quantity": "number"}], "totalAmount": "decimal", "status": "string", "deliveryTrackingId": "string", "createdAt": "Date", "updatedAt": "Date" }

// Create Order model
module.exports = mongoose.model('Order', OrderSchema);
```
{
  _id: ObjectId,
  userId: ObjectId,
  products: [
    {
      productId: ObjectId,
      quantity: Number,
      price: Number // price at the time of purchase
    }
  ],
  totalAmount: Number,
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  orderStatus: String, // e.g., "pending", "shipped", "delivered"
  paymentStatus: String, // e.g., "paid", "pending"
  createdAt: Date,
  updatedAt: Date
}

{
  "_id": "ObjectId",
  "userId": "ObjectId", // Reference to User ID
  "items": [
    {
      "productId": "ObjectId",
      "quantity": "integer",
      "price": "decimal" // Price at the time of purchase
    }
  ],
  "shippingAddress": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string",
    "phone": "string"
  },
  "status": "string", // Order status: "Pending", "Shipped", "Delivered", etc.
  "trackingNumber": "string", // Used for tracking shipments
  "total": "decimal",
  "paymentStatus": "string", // Payment status: "Paid", "Pending", "Failed"
  "placedAt": "Date",
  "updatedAt": "Date"
}
