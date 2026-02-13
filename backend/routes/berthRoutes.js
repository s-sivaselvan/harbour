const express = require("express");
const router = express.Router();

const {
  createBerth,
  allocateBerth,
  deallocateBerth,
  getAllBerths
} = require("../controllers/berthController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.post("/", protect, authorize("Admin"), createBerth);

router.post(
  "/allocate",
  protect,
  authorize("Admin", "Operator"),
  allocateBerth
);

router.post(
  "/deallocate",
  protect,
  authorize("Admin", "Operator"),
  deallocateBerth
);

router.get(
  "/",
  protect,
  getAllBerths
)

module.exports = router;
