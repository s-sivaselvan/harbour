const Ship = require("../models/Ship");

const getShips = async (req, res) => {
  try {
    const ships = await Ship.find();
    res.json(ships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createShip = async (req, res) => {
  try {
    const ship = await Ship.create(req.body);
    res.status(201).json(ship);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateShip = async (req, res) => {
  try {
    const ship = await Ship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(ship);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getShips,
  createShip,
  updateShip,
};