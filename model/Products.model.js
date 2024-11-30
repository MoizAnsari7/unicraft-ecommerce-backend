const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ProductSchema = new mongoose.Schema({
    _id: { type: ObjectId, auto: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: ObjectId, ref: "Categories" }, // References Category ID
    // brand: { type: ObjectId, ref: "Brands" }, // References Brand ID
    price: { type: Number, required: true },
    discountPrice: { type: Number }, // Optional, if a discount is active
    images: [{ type: String, default: [] }], // Default to an empty array
attributes: { type: Map, of: String, default: {} }, // Default to an empty object
    rating: { type: Number, default: 0 },
    stock: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Automatically update 'updatedAt' on save
ProductSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Product", ProductSchema);
