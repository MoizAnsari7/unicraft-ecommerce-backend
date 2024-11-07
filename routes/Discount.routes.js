4. Discounts and Coupons APIs
Allows discounts and promotional coupon management for products or cart.

Discount Management

POST /api/discounts – Create a new discount for specific products or categories (admin only)
PUT /api/discounts/:discountId – Update a discount (admin only)
DELETE /api/discounts/:discountId – Remove a discount (admin only)
GET /api/discounts/active – Retrieve all active discounts
Coupon Management

POST /api/coupons – Create a coupon with details (admin only)
PUT /api/coupons/:couponId – Update a coupon (admin only)
DELETE /api/coupons/:couponId – Delete a coupon (admin only)
POST /api/coupons/apply – Apply a coupon code at checkout (validate code and apply discount if valid)