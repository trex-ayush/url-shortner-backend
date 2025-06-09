const express = require("express");
const { register, login, profile, logout } = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticate, profile);

router.post("/logout", logout);

module.exports = router;
