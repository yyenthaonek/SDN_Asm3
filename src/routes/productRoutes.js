const express = require("express");
const ProductController = require("../controllers/productController");
const auth = require("../middleware/auth");

const router = express.Router();
router.all("*", auth);
// Product Routes
router.post("/products", ProductController.createProduct);
router.get("/products", ProductController.getProducts);
router.get("/products/:id", ProductController.getProductById);
router.put("/products/:id", ProductController.updateProduct);
router.delete("/products/:id", ProductController.deleteProduct);

module.exports = router;
