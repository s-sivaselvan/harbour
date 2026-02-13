const express = require("express");
const router = express.Router();

const { makePayment } = require("../controllers/paymentController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Only Finance & Admin can record payment
router.post("/", protect, authorize("Admin", "Finance"), makePayment);

module.exports = router;
