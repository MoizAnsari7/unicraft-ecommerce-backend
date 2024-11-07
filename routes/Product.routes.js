Product APIs
Handles product listings, details, and filtering by categories or price.

GET /api/products – Get a list of products (supports filters, e.g., category, price range, etc.)
GET /api/products/:productId – Get product details
POST /api/products – Add new product (admin only)
PUT /api/products/:productId – Update product (admin only)
DELETE /api/products/:productId – Delete product (admin only)


Product APIs
Handle the listing, details, filtering, and sorting of products, allowing advanced filtering by multiple criteria.

Basic Product Operations

GET /api/products – Retrieve a paginated list of products, with optional filters such as category, price range, rating, etc.
GET /api/products/:productId – Get detailed information for a specific product
POST /api/products – Add a new product to the catalog (admin only)
PUT /api/products/:productId – Update an existing product’s information (admin only)
DELETE /api/products/:productId – Remove a product from the catalog (admin only)
Product Filters & Sorting

GET /api/products?sort=popularity – Sort products by popularity, rating, price, or date added
GET /api/products?price[min]=100&price[max]=500 – Filter products within a specific price range


const express = require('express');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get All Products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Add New Product (Admin Only)
router.post('/', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access Denied' });
  }

  const { name, category, price, stock } = req.body;
  try {
    const newProduct = new Product({ name, category, price, stock });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error adding product' });
  }
});

module.exports = router;
```
