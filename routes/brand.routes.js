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



// POST /api/brands - Add a new brand (admin only)
router.post('/', authMiddleware, async (req, res) => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access Denied' });
    }
  
    const { name, logo, description } = req.body;
    try {
      const newBrand = new Brands({
        name,
        logo,
        description
      });
      await newBrand.save();
      res.status(201).json(newBrand);
    } catch (error) {
      res.status(500).json({ message: 'Error adding brand', error });
    }
  });
