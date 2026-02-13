const mongoose = require("mongoose");

const berthSchema = new mongoose.Schema(
  {
    berthNumber: { type: String, required: true, unique: true },

    status: {
      type: String,
      enum: ["Available", "Occupied"],
      default: "Available",
    },

    ship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ship",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Berth", berthSchema);
