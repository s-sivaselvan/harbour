const express = require("express");
const router = express.Router();

const {
  createCargo,
  updateCargoStatus,
  getAllCargo,
  getCargoByShip,
  getCargoById,
  deleteCargo,
  getCargoByStatus,
} = require("../controllers/cargoController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Only Admin & Operator can add cargo
router.post("/", protect, authorize("Admin", "Operator"), createCargo);
router.put(
  "/status",
  protect,
  authorize("Admin", "Operator"),
  updateCargoStatus
);
router.get("/",protect,getAllCargo);
router.get("/ship/:shipId",protect,getCargoByShip);
router.get("/:id", protect,getCargoById);
router.get("/status/:status",protect, getCargoByStatus);
router.delete("/:cargoId",protect,  authorize("Admin", "Operator"),deleteCargo);
module.exports = router;

