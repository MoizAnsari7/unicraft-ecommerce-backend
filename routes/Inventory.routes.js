Inventory APIs (Optional)
Tracks and updates inventory levels. Useful if you manage inventory in different locations.

GET /api/inventory/:productId – Get inventory levels for a product
POST /api/inventory – Add inventory (admin only)
PUT /api/inventory/:productId – Update inventory levels (admin only)

7. Inventory APIs
Manage and track inventory for products.

Inventory Management
GET /api/inventory/:productId – Get current stock level of a product
POST /api/inventory – Add or update inventory for multiple products (admin only)
PUT /api/inventory/:productId – Update stock for a specific product
