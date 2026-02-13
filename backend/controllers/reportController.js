const Ship = require("../models/Ship");
const Berth = require("../models/Berth");
const Cargo = require("../models/Cargo");
const Bill = require("../models/Bill");
const Payment = require("../models/Payment");

// Dashboard metrics
exports.getDashboardMetrics = async (req, res) => {
  try {
    const totalShips = await Ship.countDocuments();
    const dockedShips = await Ship.countDocuments({ status: "Docked" });
    const departedShips = await Ship.countDocuments({ status: "Departed" });

    const totalBerths = await Berth.countDocuments();
    const occupiedBerths = await Berth.countDocuments({ status: "Occupied" });
    const availableBerths = await Berth.countDocuments({ status: "Available" });

    const loadingCargo = await Cargo.countDocuments({ status: "Loading" });
    const unloadingCargo = await Cargo.countDocuments({ status: "Unloading" });
    const completedCargo = await Cargo.countDocuments({ status: "Completed" });

    const totalBills = await Bill.countDocuments();
    const paidBills = await Bill.countDocuments({ status: "Paid" });
    const pendingBills = await Bill.countDocuments({ status: "Pending" });

    const totalPayments = await Payment.countDocuments();

    res.json({
      totalShips,
      dockedShips,
      departedShips,
      totalBerths,
      occupiedBerths,
      availableBerths,
      loadingCargo,
      unloadingCargo,
      completedCargo,
      totalBills,
      paidBills,
      pendingBills,
      totalPayments,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
