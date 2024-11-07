const mongoose = require('mongoose');

// Product Schema for MongoDB
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

{ "_id": "ObjectId", "name": "string", "categoryId": "ObjectId", "price": "decimal", "stock": "number", "brandId": "ObjectId", "discountId": "ObjectId", "createdAt": "Date", "updatedAt": "Date" }

// Create Product model
module.exports = mongoose.model('Product', ProductSchema);
```


{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  discount: Number, // discount amount or percentage
  categoryId: ObjectId,
  images: [String], // URLs to images
  stock: Number, // quantity available
  rating: Number, // average rating based on reviews
  reviewIds: [ObjectId], // references to reviews
  createdAt: Date,
  updatedAt: Date
}
{
  "_id": "ObjectId",
  "name": "string",
  "description": "string",
  "category": "ObjectId", // References Category ID
  "brand": "ObjectId", // References Brand ID
  "price": "decimal",
  "discountPrice": "decimal", // Optional, used if a discount is active
  "images": ["string"], // URLs for product images
  "rating": "decimal",
  "stock": "integer", // Current stock level
  "attributes": { "color": "string", "size": "string" }, // Dynamic attributes
  "createdAt": "Date",
  "updatedAt": "Date"
}
