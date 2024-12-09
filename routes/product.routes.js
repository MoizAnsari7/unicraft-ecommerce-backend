const express = require('express');
const mongoose = require('mongoose');
const Product = require('../model/Products.model');

const authMiddleware = require('../middlewares/authMiddleware');
const Categories = require("../model/Categories.model"); // Middleware for admin check

const authMiddleware = require('../middlewares/authMiddleware'); // Middleware for admin check
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth'); // Middleware for admin check

const router = express.Router();
const uploads = require('../multer');


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
    const products = await Product.find(filter).populate('category')
      .sort(sortOption)
      .exec();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
}); 


// GET /api/allProducts/ - Get All products
router.get('/allProducts', async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }
    
    const updatedProducts = products.map(product => ({
      ...product.toObject(),
      imagePath: product.images && product.images[0]
        ? `http://localhost:3000/${product.images[0]}`
        : null, // Handle cases with no image
    }));
    
    res.status(200).json({ message: 'Products found', products: updatedProducts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product details', error });
  }
});



// GET /api/products/:productId - Get details of a specific product
router.get('/:productId', async (req, res) => {
  try {
    // Fetch the product by ID
    const product = await Product.findById(req.params.productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Add imagePath dynamically
    const updatedProduct = {
      ...product.toObject(),
      imagePath: product.images?.map((image) => `http://localhost:3000/${image}`), // Returns an array of image URLs
    };

    // Send the response
    res.status(200).json({
      message: 'Product found',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ message: 'Error fetching product details', error });
  }
});



 // POST /api/products/addProduct - Add a new product (admin only)
router.post('/addProduct' , authMiddleware, uploads.array('images',5), async (req, res) => {
  console.log('Uploaded files:', req.files);
  
  // Check if the user has admin privileges
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access Denied: Only admins can add products.' });
  }

  
  const {
    name,
    description,
    category, // Category ID from request body
    brand,
      price,
      discountPrice,
      images,
      stock,
      attributes ,
    } = req.body;
    
    console.log('Incoming Payload:', req.body);
    
    try {
      // Validate required fields
      if (!name || !price || !stock || !category) {
        return res.status(400).json({ message: 'Missing required fields: name, price, stock, or category.' });
      }
      
      // Check if the category exists
      const categoryExists = await Categories.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ message: 'Category not found. Please provide a valid category ID.' });
      }
      
      
      const parsedAttributes = attributes ? JSON.parse(attributes) : {};
      const imagePaths = req.files.map((file) => `uploads/${file.filename}`);

      // Create a new product instance
      const newProduct = new Product({
          name,
          description: description || '',
          category, // Reference the existing category ID
          brand: brand || '',
          price,
          discountPrice: discountPrice || null,
          images: imagePaths,
          stock,
          attributes : parsedAttributes,
      });

      // Save the new product to the database
      await newProduct.save();

      // Send success response
      res.status(201).json({
          message: 'Product added successfully!',
          product: newProduct,
      });
      console.log("Product successfully added:", newProduct);
  } catch (error) {
      // Handle errors and send appropriate response
      console.error('Error adding product:', error);
      res.status(500).json({
          message: 'Internal Server Error: Could not add product.',
          error: error.message,
      });
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
      ).populate('category');
  
      if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json({ message: 'Product Updated' ,updatedProduct});
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