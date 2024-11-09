const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: false,
  }, // Reference to Product ID
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false,
  }, // Reference to Category ID
  discountPercentage: { type: Number, required: true, min: 0, max: 100 }, // Discount percentage
  startDate: { type: Date, required: true }, // Start date of discount
  endDate: { type: Date, required: true }, // End date of discount
  isActive: { type: Boolean, default: true }, // Status of discount
  createdAt: { type: Date, default: Date.now }, // Record creation date
  updatedAt: { type: Date, default: Date.now }, // Record update date
});

// Update `updatedAt` field automatically on document modification
DiscountSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Discount", DiscountSchema);
