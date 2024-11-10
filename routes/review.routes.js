const express = require('express');
const Review = require('../models/Review');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const router = express.Router();

// GET /api/reviews/:productId - Get all reviews for a product
router.get('/reviews/:productId', async (req, res) => {
  const { sort } = req.query;

  try {
    let sortOption = {};
    if (sort === 'recent') sortOption = { createdAt: -1 };
    else if (sort === 'highest') sortOption = { rating: -1 };
    else if (sort === 'helpful') sortOption = { helpfulCount: -1 }; // Assuming helpfulness tracking is implemented

    const reviews = await Review.find({ productId: req.params.productId }).sort(sortOption);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reviews', error });
  }
});