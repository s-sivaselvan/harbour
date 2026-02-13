const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    ship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ship",
      required: true,
    },
    berth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Berth",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);
