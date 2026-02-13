const mongoose = require("mongoose");

const shipSchema = new mongoose.Schema({
  shipName: { type: String, required: true },
  imoNumber: { type: String, required: true, unique: true },
  captainName: { type: String, required: true },
  arrivalTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Arrived", "Docked", "Departed"],
    default: "Arrived",
  },
  berth: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Berth",
    default: null,
  },
});

module.exports = mongoose.model("Ship", shipSchema);
