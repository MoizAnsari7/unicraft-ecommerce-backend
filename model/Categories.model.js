const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

// Category Schema
const CategoriesSchema = new mongoose.Schema({
  _id: { type: ObjectId, auto: true },  // Auto-generates ObjectId if not provided
  name: { type: String, required: true, trim: true },  // Category name
  description: { type: String, default: '', trim: true },  // Optional description
  parentCategoryId: { type: ObjectId, ref: 'Categories', default: null },  // Reference to a parent category
  createdAt: { type: Date, default: Date.now },  // Date created
  updatedAt: { type: Date, default: Date.now }  // Date updated
});

// Automatically update 'updatedAt' on save
CategoriesSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Categories', CategoriesSchema);
