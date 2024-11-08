
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

  module.exports = router;