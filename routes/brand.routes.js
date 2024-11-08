const express = require('express');
const mongoose = require('mongoose');
const Brands = require('../models/Brands');
const authMiddleware = require('../middleware/auth');  // Middleware to check user roles
const router = express.Router();

// GET /api/brands - Retrieve all brands
router.get('/', async (req, res) => {
  try {
    const brands = await Brands.find({});
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching brands', error });
  }
});
