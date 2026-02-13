const express = require("express");
const router = express.Router();

const {
  generateBill,
  getAllBills,
  downloadBillPDF,
} = require("../controllers/billController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.post("/",protect, authorize("Admin", "Finance"), generateBill);
router.get("/", getAllBills);
router.get("/:id/pdf", protect, authorize("Admin", "Finance"), downloadBillPDF);

module.exports = router;
