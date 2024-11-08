
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
  

  module.exports = router;