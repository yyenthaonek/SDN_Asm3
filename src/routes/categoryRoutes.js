const express = require("express");
const CategoryController = require("../controllers/categoryController");
const auth = require("../middleware/auth");

const router = express.Router();
router.all("*", auth);
// Category Routes
router.post("/categories", CategoryController.createCategory);
router.get("/categories", CategoryController.getCategories);
router.get("/categories/:id", CategoryController.getCategoryById);
router.put("/categories/:id", CategoryController.updateCategory);
router.post("/categories/:id", CategoryController.deleteCategory);

module.exports = router;
