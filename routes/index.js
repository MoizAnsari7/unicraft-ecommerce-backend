//all routes final link will come here
const express = require("express");
const router = express.Router();
//import routes
//category routes
const CategoryRoutes = require("./category.routes");

router.use("/category", CategoryRoutes);

module.exports = router;