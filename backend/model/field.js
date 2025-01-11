const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  fieldName: { type: String, required: true },
  location: { latitude: Number, longitude: Number },
  cropType: { type: String, required: true },
  areaSize: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Field", FieldSchema);
