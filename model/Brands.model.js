const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const BrandsSchema = new mongoose.Schema({
  _id: { type: ObjectId, auto: true },
  name: { type: String, required: true, trim: true },
  logo: { type: String, trim: true },  // URL to the brand logo
  description: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Automatically update 'updatedAt' on save
BrandsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Brands', BrandsSchema);
