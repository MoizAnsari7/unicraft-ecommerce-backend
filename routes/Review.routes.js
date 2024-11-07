Review APIs
Allows users to leave reviews and ratings for products.

GET /api/reviews/:productId – Get all reviews for a product
POST /api/reviews/:productId – Add a review for a product (authentication required)
PUT /api/reviews/:reviewId – Update review (authentication required, only for review author)
DELETE /api/reviews/:reviewId – Delete review (authentication required, only for review author or admin)


6. Review APIs
Enable users to leave feedback and ratings on products.

Review Management

GET /api/reviews/:productId – Get all reviews for a specific product
POST /api/reviews/:productId – Add a review (requires user authentication)
PUT /api/reviews/:reviewId – Update an existing review (only the review author can update)
DELETE /api/reviews/:reviewId – Delete a review (allowed for author or admin)
Advanced Review Filters

GET /api/reviews/:productId?sort=recent – Sort reviews by recent, highest rated, or most helpful

