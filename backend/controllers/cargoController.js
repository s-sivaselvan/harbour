const Cargo = require("../models/Cargo");
const Ship = require("../models/Ship");

// Create Cargo
exports.createCargo = async (req, res) => {
  try {
    const { shipId, cargoType, quantity } = req.body;

    // check if ship exists
    const ship = await Ship.findById(shipId);
    if (!ship) {
      return res.status(404).json({ message: "Ship not found" });
    }

    const cargo = await Cargo.create({
      ship: ship._id,
      cargoType,
      quantity,
    });

    res.status(201).json({
      message: "Cargo added successfully",
      cargo,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Cargo Status
// Update Cargo Status
exports.updateCargoStatus = async (req, res) => {
  try {
    const { cargoId, status } = req.body;

    // validate input
    if (!cargoId || !status) {
      return res.status(400).json({ message: "cargoId and status are required" });
    }

    // validate status value
    const allowedStatus = ["Loading", "Unloading", "Completed"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid cargo status" });
    }

    // find cargo
    const cargo = await Cargo.findById(cargoId);
    if (!cargo) {
      return res.status(404).json({ message: "Cargo not found" });
    }

    // update status
    cargo.status = status;
    await cargo.save();

    res.status(200).json({
      message: "Cargo status updated successfully",
      cargo,
    });
  } catch (error) {
    console.error("Update cargo status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get all cargo
exports.getAllCargo = async (req, res) => {
  try {
    const cargoList = await Cargo.find()
      .populate("ship", "name status");

    res.status(200).json(cargoList);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get cargo by ship
exports.getCargoByShip = async (req, res) => {
  try {
    const { shipId } = req.params;

    const cargoList = await Cargo.find({ ship: shipId })
      .populate("ship", "name status");

    res.status(200).json(cargoList);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get cargo by ID
exports.getCargoById = async (req, res) => {
  try {
    const { id } = req.params;

    const cargo = await Cargo.findById(id)
      .populate("ship", "name status");

    if (!cargo) {
      return res.status(404).json({ message: "Cargo not found" });
    }

    res.status(200).json(cargo);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete cargo
exports.deleteCargo = async (req, res) => {
  try {
    const { cargoId } = req.params;

    const cargo = await Cargo.findById(cargoId);
    if (!cargo) {
      return res.status(404).json({ message: "Cargo not found" });
    }

    await cargo.deleteOne();

    res.json({ message: "Cargo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get cargo by status
exports.getCargoByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    if (!["Loading", "Unloading", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const cargoList = await Cargo.find({ status })
      .populate("ship", "name status");

    res.status(200).json(cargoList);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

