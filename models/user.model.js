const mongoose = require('mongoose');

// User Schema for MongoDB
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'user' },  // Default role is 'user'
  "role": "string", "addresses": [...], "orderHistory": [...], 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create User model
module.exports = mongoose.model('User', UserSchema);
```

{
  _id: ObjectId,
  username: String,
  email: String,
  password: String, // hashed password
  role: String, // e.g., "customer" or "admin"
  createdAt: Date,
  addresses: [
    {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    }
  ],
  orderHistory: [{ orderId: ObjectId }]
}
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "passwordHash": "string",
  "role": "string", // Roles: "Customer", "Admin", "Manager", etc.
  "addresses": [
    {
      "_id": "ObjectId",
      "street": "string",
      "city": "string",
      "state": "string",
      "zip": "string",
      "country": "string",
      "phone": "string",
      "default": "boolean" // Indicates primary address
    }
  ],
  "orderHistory": ["ObjectId"], // References Order IDs
  "createdAt": "Date",
  "updatedAt": "Date"
}
