const express = require("express");
const {
  getShips,
  createShip,
  updateShip,
} = require("../controllers/shipController");

const router = express.Router();

router.get("/", getShips);
router.post("/", createShip);
router.put("/:id", updateShip);

module.exports = router; // ✅ MUST be this
