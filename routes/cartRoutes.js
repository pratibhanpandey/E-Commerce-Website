const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const { saveCart, getCart } = require("../controllers/cartController");

// Save cart to DB
router.post("/save", saveCart);

// Get cart using controller
router.get("/", getCart);

// Get cart directly (used by checkout)
router.get("/get", async (req, res) => {
  const { userEmail } = req.query;
  try {
    const cart = await Cart.findOne({ userEmail });
    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ message: "Cart is empty", items: [] });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear cart by user
router.delete("/clear", async (req, res) => {
  const { userEmail } = req.query;
  try {
    await Cart.deleteOne({ userEmail });
    res.status(200).json({ message: "Cart cleared from DB" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Export only AFTER all routes are defined
module.exports = router;

