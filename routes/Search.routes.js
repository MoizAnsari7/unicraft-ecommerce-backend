8. Search API
Implements product search with filters like price, category, rating, etc.

GET /api/search – Search products (supports query parameters for filters like keyword, category, price range, rating, etc.)

8. Search API
Enables product search with filters and advanced querying options.

Product Search
GET /api/search?query=keywords – Perform a basic search with keywords
GET /api/search?category=electronics&price[min]=100&price[max]=500 – Filter search results based on category, price, and other criteria
