const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

// Category Schema
const CategoriesSchema = new mongoose.Schema({
  _id: { type: ObjectId, auto: true },  // Auto-generates ObjectId if not provided
  name: { type: String, required: true, trim: true, unique: true },  // Category name
  createdAt: { type: Date, default: Date.now },  // Date created
  updatedAt: { type: Date, default: Date.now }  // Date updated
});

// Automatically update 'updatedAt' on save
CategoriesSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Categories', CategoriesSchema);
