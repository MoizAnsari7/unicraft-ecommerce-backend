const express = require('express');
const Product = require('../model/Products.model'); // Assuming the Product model is set up with the necessary fields
const Product = require('../models/Product'); // Assuming the Product model is set up with the necessary fields
const router = express.Router();

// GET /api/search - Search products with filters
router.get('/search', async (req, res) => {
  const { query, category, 'price[min]': minPrice, 'price[max]': maxPrice, minRating } = req.query;

  try {
    // Build search criteria based on the query parameters
    let searchCriteria = {};

    // Keyword search on product name or description
    if (query) {
      searchCriteria.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      searchCriteria.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      searchCriteria.price = {};
      if (minPrice) searchCriteria.price.$gte = parseFloat(minPrice);
      if (maxPrice) searchCriteria.price.$lte = parseFloat(maxPrice);
    }

    // Filter by minimum rating
    if (minRating) {
      searchCriteria.rating = { $gte: parseInt(minRating) };
    }

    // Execute the search query
    const products = await Product.find(searchCriteria);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error performing search', error });
  }
});

module.exports = router;
