const Cart = require("../models/Cart");

// Save or Update cart for user
exports.saveCart = async (req, res) => {
  const { userEmail, items } = req.body;

  try {
    const updated = await Cart.findOneAndUpdate(
      { userEmail },
      { items },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: "Cart saved", cart: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get cart for user
exports.getCart = async (req, res) => {
  const { userEmail } = req.query;

  try {
    const cart = await Cart.findOne({ userEmail });
    if (!cart) return res.status(404).json({ message: "Cart is empty" });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
