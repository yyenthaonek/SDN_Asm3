const express = require("express");
const UserController = require("../controllers/userController");
const router = express.Router();
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/authAdmin");
router.all("*", auth);

router.post("/user", UserController.getUser);
router.post("/users/generate", UserController.generateAdmin);
router.post("/register", UserController.createUser);
router.put("/account/:id", UserController.updateAccount);
router.get("/auth", UserController.getCurrentAccount);
router.put("/users/change-password", UserController.changePassword);
router.delete("/users/:id", isAdmin ,UserController.deleteAccount);
router.put("/users/change-role", isAdmin, UserController.changeRole);
router.put("/users/change-status", isAdmin, UserController.changeStatus);
router.post("/users/create", isAdmin, UserController.createUser);

module.exports = router;
