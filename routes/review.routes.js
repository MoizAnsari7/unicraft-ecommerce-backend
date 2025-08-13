const express = require('express');
const Review = require('../model/Review.model');
const {authMiddleware} = require('../middlewares/authMiddleware');
const {adminMiddleware} = require('../middlewares/authMiddleware');
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

// POST /api/reviews/:productId - Add a review for a product (auth required)
router.post('/reviews/:productId', authMiddleware, async (req, res) => {
    const { rating, comment } = req.body;
  
    try {
      const review = new Review({
        productId: req.params.productId,
        userId: req.user._id,
        rating,
        comment,
      });
      await review.save();
      res.status(201).json({ message: 'Review added', review });
    } catch (error) {
      res.status(500).json({ message: 'Error adding review', error });
    }
  });


  // PUT /api/reviews/:reviewId - Update a review (auth required, only for author)
router.put('/reviews/:reviewId', authMiddleware, async (req, res) => {
    const { rating, comment } = req.body;
  
    try {
      const review = await Review.findOne({ _id: req.params.reviewId, userId: req.user._id });
      if (!review) {
        return res.status(403).json({ message: 'You are not allowed to update this review' });
      }
  
      review.rating = rating || review.rating;
      review.comment = comment || review.comment;
      review.updatedAt = Date.now();
      await review.save();
  
      res.status(200).json({ message: 'Review updated', review });
    } catch (error) {
      res.status(500).json({ message: 'Error updating review', error });
    }
  });



// DELETE /api/reviews/:reviewId - Delete a review (auth required, for author or admin)
router.delete('/reviews/:reviewId', authMiddleware, async (req, res) => {
    try {
      const review = await Review.findById(req.params.reviewId);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      // Allow deletion only if user is the author or an admin
      if (review.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        return res.status(403).json({ message: 'You are not allowed to delete this review' });
      }
  
      await review.remove();
      res.status(200).json({ message: 'Review deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting review', error });
    }
  });
  
  module.exports = router;