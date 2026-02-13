const mongoose = require("mongoose");

const cargoSchema = new mongoose.Schema(
  {
    ship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ship",
      required: true,
    },
    cargoType: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Loading", "Unloading", "Completed"],
      default: "Loading",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cargo", cargoSchema);
