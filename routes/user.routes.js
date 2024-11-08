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