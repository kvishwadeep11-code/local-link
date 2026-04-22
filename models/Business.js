const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    description: String,
    contact: String,
    address: String,
    owner: String,
    views: { type: Number, default: 0 },
    interactions: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", BusinessSchema);
