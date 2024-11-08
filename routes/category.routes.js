
// const express = require('express');
const mongoose = require('mongoose');
const Categories = require('../models/Categories');
const authMiddleware = require('../middleware/auth');  // Middleware to check user roles
const router = express.Router();

// GET /api/categories - Retrieve all categories
router.get('/', async (req, res) => {
    try {
      const categories = await Categories.find({});
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching categories', error });
    }
  });


  // POST /api/categories - Create a new category (admin only)
router.post('/', authMiddleware, async (req, res) => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access Denied' });
    }
  
    const { name, description, parentCategoryId } = req.body;
    try {
      const newCategory = new Categories({
        name,
        description,
        parentCategoryId: parentCategoryId || null,
      });
      await newCategory.save();
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ message: 'Error creating category', error });
    }
  });
  

  // GET /api/categories/:categoryId - Get details for a specific category
router.get('/:categoryId', async (req, res) => {
    try {
      const category = await Categories.findById(req.params.categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching category', error });
    }
  });


  // PUT /api/categories/:categoryId - Update a category's information (admin only)
router.put('/:categoryId', authMiddleware, async (req, res) => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access Denied' });
    }
  
    const { name, description, parentCategoryId } = req.body;
    try {
      const updatedCategory = await Categories.findByIdAndUpdate(
        req.params.categoryId,
        { name, description, parentCategoryId: parentCategoryId || null },
        { new: true }
      );
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: 'Error updating category', error });
    }
  });


  // DELETE /api/categories/:categoryId - Delete a category (admin only)
router.delete('/:categoryId', authMiddleware, async (req, res) => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access Denied' });
    }
  
    try {
      const deletedCategory = await Categories.findByIdAndDelete(req.params.categoryId);
      if (!deletedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting category', error });
    }
  });
  

  // GET /api/categories/:categoryId/products - Retrieve products under a specific category, with pagination and sorting
router.get('/:categoryId/products', async (req, res) => {
    const { page = 1, limit = 10, sort = 'name' } = req.query;  // Pagination and sorting parameters
    const categoryId = req.params.categoryId;
  
    try {
      // Fetch products under this category
      const products = await Product.find({ categoryId: categoryId })
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit));
  
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products under category', error });
    }
  });
  
  

  module.exports = router;