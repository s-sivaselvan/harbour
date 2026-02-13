const Bill = require("../models/Bill");
const Ship = require("../models/Ship");
const Berth = require("../models/Berth");
const PDFDocument = require("pdfkit");

// Generate Bill
exports.generateBill = async (req, res) => {
  try {
    const { shipId, berthId, amount } = req.body;

    const ship = await Ship.findById(shipId);
    if (!ship) return res.status(404).json({ message: "Ship not found" });

    const berth = await Berth.findById(berthId);
    if (!berth) return res.status(404).json({ message: "Berth not found" });

    const bill = await Bill.create({
      ship: ship._id,
      berth: berth._id,
      amount,
    });

    res.status(201).json({ message: "Bill generated", bill });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get all bills
exports.getAllBills = async (req, res) => {
  const bills = await Bill.find()
    .populate("ship", "shipName")
    .populate("berth", "berthNumber");

  res.json({
    bills,
  });
};


// 🔹 Download bill as PDF
exports.downloadBillPDF = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate("ship", "shipName")
      .populate("berth", "berthNumber");

    if (!bill) return res.status(404).json({ message: "Bill not found" });

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=bill-${bill._id}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(18).text("Port Management Bill", { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Bill ID: ${bill._id}`);
    doc.text(`Ship: ${bill.ship.shipName}`);
    doc.text(`Berth: ${bill.berth.berthNumber}`);
    doc.text(`Amount: ₹${bill.amount}`);
    doc.text(`Status: ${bill.status}`);
    doc.text(`Date: ${bill.createdAt.toDateString()}`);

    doc.end();
  } catch (err) {
    res.status(500).json({ message: "PDF generation failed" });
  }
};
