const express = require('express');
const User = require('../model/User');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// POST /api/users/register - Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Code to create new user after hashing password, etc.
    const user = new User({
      username,
      email,
      passwordHash: /* hashed password here */
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});


// POST /api/users/login - Log in an existing user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      // Code to authenticate user and return token
      res.status(200).json({ message: 'Login successful', token: /* JWT token here */ });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  });



// GET /api/users/profile - Get user profile (authentication required)
router.get('/profile', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving profile', error });
    }
  });


  // PUT /api/users/profile - Update user profile (authentication required)
router.put('/profile', authMiddleware, async (req, res) => {
    const { username, email } = req.body;
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.username = username ?? user.username;
      user.email = email ?? user.email;
      await user.save();
  
      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error });
    }
  });
  

  // GET /api/users/orders - Get order history for a user (authentication required)
router.get('/orders', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate('orderHistory');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.status(200).json(user.orderHistory);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving order history', error });
    }
  });

  
  // POST /api/users/address - Add new address
router.post('/address', authMiddleware, async (req, res) => {
    const { street, city, state, country, postalCode } = req.body;
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.addresses.push({ street, city, state, country, postalCode });
      await user.save();
  
      res.status(201).json({ message: 'Address added successfully', addresses: user.addresses });
    } catch (error) {
      res.status(500).json({ message: 'Error adding address', error });
    }
  });