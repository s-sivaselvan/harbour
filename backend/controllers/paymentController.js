const Payment = require("../models/Payment");
const Bill = require("../models/Bill");

// Record Payment
exports.makePayment = async (req, res) => {
  try {
    const { billId, paymentMethod, amountPaid } = req.body;

    // Check bill
    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    // Create payment record
    const payment = await Payment.create({
      bill: bill._id,
      paymentMethod,
      amountPaid,
    });

    // Update bill status if fully paid
    if (amountPaid >= bill.amount) {
      bill.status = "Paid";
      await bill.save();
    }

    res.status(201).json({
      message: "Payment recorded successfully",
      payment,
      bill,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
