import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// Place Order (using COD)
export async function placeOrderCOD(req, res) {
  try {
    const { userId, items, address } = req.body;
    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data 🔴" });
    }
    // Calculate Amount Using Items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);
    // Add Tax-Charge (2%)
    amount += Math.floor(amount * 0.02);
    await Order.create({ userId, items, amount, address, paymentType: "COD" });
    return res.json({ success: true, message: "Order placed successfully ✅" });
  } catch (err) {
    console.log("🔴 COMPLETE ERROR: ", err);
    res.json({ success: false, message: err.message });
  }
}

// Get Individual Order by User ID
export async function getUserOrders(req, res) {
  try {
    const { userId } = req.body;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      message: "Order-Data fetched successfully ✅",
      orders,
    });
  } catch (err) {
    console.log("🔴 COMPLETE ERROR: ", err);
    res.json({ success: false, message: err.message });
  }
}

// Get All Orders for ADMIN/SELLER
export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      message: "Orders fetched successfully ✅",
      orders,
    });
  } catch (err) {
    console.log("🔴 COMPLETE ERROR: ", err);
    res.json({ success: false, message: err.message });
  }
}
