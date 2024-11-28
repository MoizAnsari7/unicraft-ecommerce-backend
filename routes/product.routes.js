const express = require('express');
const mongoose = require('mongoose');
const Product = require('../model/Products.model');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware for admin check
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

// GET /api/products/:productId - Get details of a specific product
router.get('/:productId', async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product details', error });
    }
  });


  // POST /api/products - Add a new product (admin only)
router.post('/addProduct', authMiddleware, async (req, res) => {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Access Denied' });
  
    const { name, description, category, brand, price, discountPrice, images, stock, attributes } = req.body;
    try {
      const newProduct = new Product({
        name,
        description,
        category,
        brand,
        price,
        discountPrice,
        images,
        stock,
        attributes
      });
      await newProduct.save();
      console.log(res)
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: 'Error adding product', error });
      console.log(error)
    }
  });



// PUT /api/products/:productId - Update product details (admin only)
router.put('/:productId', authMiddleware, async (req, res) => {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Access Denied' });
  
    const { name, description, category, brand, price, discountPrice, images, stock, attributes } = req.body;
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.productId,
        {
          name,
          description,
          category,
          brand,
          price,
          discountPrice,
          images,
          stock,
          attributes,
          updatedAt: Date.now()
        },
        { new: true }
      );
  
      if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: 'Error updating product', error });
    }
  });
  
  // DELETE /api/products/:productId - Delete product (admin only)
router.delete('/:productId', authMiddleware, async (req, res) => {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Access Denied' });
  
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.productId);
      if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting product', error });
    }
  });
  
  module.exports = router;