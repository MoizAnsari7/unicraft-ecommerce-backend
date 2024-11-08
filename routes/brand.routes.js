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


  // PUT /api/brands/:brandId - Update brand information (admin only)
router.put('/:brandId', authMiddleware, async (req, res) => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access Denied' });
    }
  
    const { name, logo, description } = req.body;
    try {
      const updatedBrand = await Brands.findByIdAndUpdate(
        req.params.brandId,
        { name, logo, description, updatedAt: Date.now() },
        { new: true }
      );
  
      if (!updatedBrand) {
        return res.status(404).json({ message: 'Brand not found' });
      }
  
      res.status(200).json(updatedBrand);
    } catch (error) {
      res.status(500).json({ message: 'Error updating brand', error });
    }
  });


  // DELETE /api/brands/:brandId - Remove a brand (admin only)
router.delete('/:brandId', authMiddleware, async (req, res) => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access Denied' });
    }
  
    try {
      const deletedBrand = await Brands.findByIdAndDelete(req.params.brandId);
      if (!deletedBrand) {
        return res.status(404).json({ message: 'Brand not found' });
      }
  
      res.status(200).json({ message: 'Brand deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting brand', error });
    }
  });
