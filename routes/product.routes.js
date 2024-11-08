const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth'); // Middleware for admin check
const router = express.Router();

// GET /api/products - Retrieve products with optional filters and pagination
router.get('/', async (req, res) => {
  const { category, priceMin, priceMax, sort } = req.query;
  const filter = {};
  const sortOption = {};

  // Filtering by category, price range
  if (category) filter.category = category;
  if (priceMin) filter.price = { ...filter.price, $gte: Number(priceMin) };
  if (priceMax) filter.price = { ...filter.price, $lte: Number(priceMax) };

  // Sorting options
  if (sort === 'popularity') sortOption.rating = -1; // Example for popularity
  if (sort === 'price') sortOption.price = 1;
  if (sort === 'date') sortOption.createdAt = -1;

  try {
    const products = await Product.find(filter)
      .sort(sortOption)
      .exec();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});