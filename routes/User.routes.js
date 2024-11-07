1. User APIs
Manages user registration, login, profile, and addresses.

POST /api/users/register – Register a new user
POST /api/users/login – Log in an existing user
GET /api/users/profile – Get user profile (authentication required)
PUT /api/users/profile – Update user profile (authentication required)
GET /api/users/orders – Get order history for a user
POST /api/users/address – Add new address
PUT /api/users/address/:addressId – Update address
DELETE /api/users/address/:addressId – Delete address



Authentication and Registration

POST /api/auth/register – Register a new user
POST /api/auth/login – Log in an existing user and receive an access token
POST /api/auth/logout – Log out the user and invalidate the session
POST /api/auth/refresh – Refresh the access token
Profile and Account

GET /api/users/profile – Get user profile data (requires authentication)
PUT /api/users/profile – Update profile information
GET /api/users/orders – Retrieve the user's order history
Addresses Management

POST /api/users/address – Add a new address to the user’s account
PUT /api/users/address/:addressId – Update a specific address
DELETE /api/users/address/:addressId – Remove a specific address from the account


#### `routes/users.js`

```js
const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get User Profilea
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

module.exports = router;
