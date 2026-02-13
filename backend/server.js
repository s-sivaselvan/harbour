require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");

const app = express();
app.use(cors())
// middleware
app.use(express.json());

// connect database
connectDB();

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ships", require("./routes/shipRoutes"));
app.use("/api/berths", require("./routes/berthRoutes"));
app.use("/api/cargo", require("./routes/cargoRoutes"));
app.use("/api/bills", require("./routes/billRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

app.get("/", (req, res) => {
  res.send("Harbour Management System Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
