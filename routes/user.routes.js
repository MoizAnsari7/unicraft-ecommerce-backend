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