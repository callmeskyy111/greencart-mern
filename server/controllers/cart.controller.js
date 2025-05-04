import User from "../models/user.model.js";

// Update User-CartData
export async function updateCart(req, res) {
  try {
    const { cartItems } = req.body;
    await User.findByIdAndUpdate(req.userId, { cartItems });
    res.json({ success: true, message: "Cart Updated ☑️🛒", cartItems });
  } catch (err) {
    console.log("🔴 COMPLETE ERROR: ", err);
    res.json({ success: false, message: err.message });
  }
}
