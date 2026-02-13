const express = require("express");
const router = express.Router();

const { getDashboardMetrics } = require("../controllers/reportController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Only Admin & Finance can view dashboard
router.get(
  "/dashboard",
  protect,
  authorize("Admin", "Finance"),
  getDashboardMetrics
);

module.exports = router;
