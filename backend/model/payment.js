const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  transactionId: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Payment", PaymentSchema);
