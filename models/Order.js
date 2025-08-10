const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userEmail: String,
  name: String,
  phone: String,
  address: String,
  items: Array,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
