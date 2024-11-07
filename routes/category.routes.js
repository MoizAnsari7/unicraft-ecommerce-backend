Category APIs
Manages product categories, allowing nested category structures for easy filtering.

GET /api/categories – Get all categories
GET /api/categories/:categoryId – Get details of a specific category
POST /api/categories – Create new category (admin only)
PUT /api/categories/:categoryId – Update category (admin only)
DELETE /api/categories/:categoryId – Delete category (admin only)


. Category APIs
Organize products into categories for easy navigation and filtering.

Category Management

GET /api/categories – Retrieve all categories with a nested structure if applicable
GET /api/categories/:categoryId – Get details for a specific category
POST /api/categories – Create a new category (admin only)
PUT /api/categories/:categoryId – Update a category’s information (admin only)
DELETE /api/categories/:categoryId – Delete a category (admin only)
Advanced Filtering by Category

GET /api/categories/:categoryId/products – Retrieve products under a specific category, including pagination and sorting

Category Management

GET /api/categories – Retrieve all categories
GET /api/categories/:categoryId – Get details for a category
POST /api/categories – Create a new category (admin only)
PUT /api/categories/:categoryId – Update a category (admin only)
DELETE /api/categories/:categoryId – Delete a category (admin only)

app.get("/", ( req, res )=> {
    
    console.log("inside test controller");

    return res.status(200).json({
        status : 200,
        msg : "API is working"
    });
})