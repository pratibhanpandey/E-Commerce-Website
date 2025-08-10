const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  items: [
    {
      name: String,
      price: String,
      img: String,
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
