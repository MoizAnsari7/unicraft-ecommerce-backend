const express = require('express');
const Cart = require('../model/Carts.model');
const Product = require('../model/Products.model');
const Coupon = require('../model/Coupon.model');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware for user authentication
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const authMiddleware = require('../middleware/auth'); // Middleware for user authentication
const router = express.Router();

// Helper function to calculate cart total
async function calculateCartTotal(items) {
    let total = 0;
    for (const item of items) {
        const product = await Product.findById(item.productId);
        if (product) {
            total += product.price * item.quantity;
        }
    }
    return total;
}

// GET /api/cart - Retrieve the user's current cart
router.get('/', authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving cart', error });
    }
});



// POST /api/cart - Add a product to the cart
router.post('/', authMiddleware, async (req, res) => {
    const { productId, quantity } = req.body;
    try {

      console.log("backend res", req.body);
      console.log("backend res", req.userId);
      
        let cart = await Cart.findOne({ userId: req.userId });
        if (!cart) {
            cart = new Cart({ userId: req.userId, items: [], total: 0 });
        }

        // Check if item already exists in the cart
        const existingItem = cart.items.find(item => item.productId.equals(productId));
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        } 

        // Update cart total
        cart.total = await calculateCartTotal(cart.items);
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error });
    }
});



// PUT /api/cart/:productId - Update the quantity of a product in the cart
router.put('/:productId', authMiddleware, async (req, res) => {
    const { quantity } = req.body;
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.find(item => item.productId.equals(req.params.productId));
        if (item) {
            item.quantity = quantity;
            cart.total = await calculateCartTotal(cart.items);
            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart item', error });
    }
});


// DELETE /api/cart/:productId - Remove a product from the cart
router.delete('/:productId', authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => !item.productId.equals(req.params.productId));
        cart.total = await calculateCartTotal(cart.items);
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart', error });
    }
});


// DELETE /api/cart - Clear the entire cart
router.delete('/', authMiddleware, async (req, res) => {
    try {
      const cart = await Cart.findOneAndUpdate(
        { userId: req.user._id },
        { items: [], total: 0 },
        { new: true }
      );
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error clearing cart', error });
    }
  });
   


  // POST /api/cart/save - Save specific items for later
router.post('/save', authMiddleware, async (req, res) => {
    const { productId, saveForLater } = req.body;
    try {
      const cart = await Cart.findOne({ userId: req.user._id });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      const item = cart.items.find(item => item.productId.equals(productId));
      if (item) {
        item.savedForLater = saveForLater;
        await cart.save();
        res.status(200).json(cart);
      } else {
        res.status(404).json({ message: 'Product not found in cart' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error saving item for later', error });
    }
  });
  

// POST /api/cart/apply-coupon - Apply a coupon code to the cart
router.post('/apply-coupon', authMiddleware, async (req, res) => {
    const { couponId } = req.body;
    try {
      const cart = await Cart.findOne({ userId: req.user._id });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      const coupon = await Coupon.findById(couponId);
      if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
  
      cart.appliedCoupon = coupon._id;
      cart.total = await calculateCartTotal(cart.items) * (1 - coupon.discount / 100);
      await cart.save();
  
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error applying coupon', error });
    }
  });
  
  module.exports = router;


