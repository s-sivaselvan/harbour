const Berth = require("../models/Berth");
const Ship = require("../models/Ship");

// Create Berth
exports.createBerth = async (req, res) => {
  try {
    const { berthNumber } = req.body;

    const berthExists = await Berth.findOne({ berthNumber });
    if (berthExists) {
      return res.status(400).json({ message: "Berth already exists" });
    }

    const berth = await Berth.create({
      berthNumber,
    });

    res.status(201).json({
      message: "Berth created successfully",
      berth,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.allocateBerth = async (req, res) => {
  const { shipId, berthId } = req.body;

  const ship = await Ship.findById(shipId);
  const berth = await Berth.findById(berthId);

  if (!ship || !berth) {
    return res.status(404).json({ message: "Ship or Berth not found" });
  }

  if (berth.status !== "Available") {
    return res.status(400).json({ message: "Berth not available" });
  }

  berth.status = "Occupied";
  berth.ship = ship._id;
  await berth.save();

  ship.status = "Docked";
  ship.berth = berth._id;
  await ship.save();

  res.json({ message: "Berth allocated successfully" });
};


exports.deallocateBerth = async (req, res) => {
  const { berthId } = req.body;

  const berth = await Berth.findById(berthId);
  if (!berth) {
    return res.status(404).json({ message: "Berth not found" });
  }

  const ship = await Ship.findById(berth.ship);

  berth.status = "Available";
  berth.ship = null;
  await berth.save();

  if (ship) {
    ship.status = "Departed";
    ship.berth = null;
    ship.departureTime = new Date();
    await ship.save();
  }

  res.json({ message: "Ship departed successfully" });
};

exports.getAllBerths = async (req, res) => {
  try {
    const berths = await Berth.find()
      .populate("ship", "shipName"); // optional, useful for UI

    res.status(200).json(berths);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
