//all routes final link will come here
const express = require("express");
const router = express.Router();
//import routes
//category routes
const adminRoutes = require("./admin.routes");
const brandRoutes = require("./brand.routes");
const cartRoutes = require("./cart.routes");
const CategoryRoutes = require("./category.routes");
const couponRoutes = require("./coupon.routes");
const deliveryActivityRoutes = require("./deliveryActivity.routes");
const deliveryCoordinatorRoutes = require("./deliveryCoordinator.routes");
const deliveryPartnerRoutes = require("./deliveryPartner.routes");
const discountRoutes = require("./discount.routes");
const inventoryRoutes = require("./inventory.routes");
const notificationRoutes = require("./notification.routes");
const orderRoutes = require("./order.routes");
const paymentRoutes = require("./payment.routes");
const productRoutes = require("./product.routes");
const reviewRoutes = require("./review.routes");
const searchRoutes = require("./search.routes");
const userRoutes = require("./user.routes");


router.use("/admin", adminRoutes);
router.use("/brand", brandRoutes);
router.use("/cart", cartRoutes);
router.use("/category", CategoryRoutes); //addCategory
router.use("/coupon", couponRoutes);
router.use("/deliveryActivity", deliveryActivityRoutes);
router.use("/deliveryCoordinator", deliveryCoordinatorRoutes);
router.use("/deliveryPartner", deliveryPartnerRoutes);
router.use("/discount", discountRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/notification", notificationRoutes);
router.use("/order", orderRoutes);
router.use("/payment", paymentRoutes);
router.use("/products", productRoutes);
router.use("/review", reviewRoutes);
router.use("/search", searchRoutes);
router.use("/users", userRoutes);

module.exports = router;
