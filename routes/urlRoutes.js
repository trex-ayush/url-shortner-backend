const express = require("express");
const { createShortUrl, deleteShortUrl, updateShortUrl, getUrlStats, deactivateUrl, getUserUrls } = require("../controllers/urlController");
const {  optionalAuthenticate, authenticate } = require("../middleware/auth");
const router = express.Router();

router.post("/create",optionalAuthenticate ,createShortUrl);
router.delete("/delete/:id",authenticate, deleteShortUrl);
router.patch("/update/:id",authenticate, updateShortUrl);
router.get("/stats/:id",authenticate, getUrlStats);
router.patch("/deactivate-url/:id", authenticate, deactivateUrl);
router.get("/user", authenticate, getUserUrls);

module.exports = router;
