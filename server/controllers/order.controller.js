import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import stripe from "stripe";

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

// Place Order (using STRIPE)
export async function placeOrderStripe(req, res) {
  try {
    const { userId, items, address } = req.body;
    const { origin } = req.headers;
    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data 🔴" });
    }
    let productData = [];

    // Calculate Amount Using Items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);
    // Add Tax-Charge (2%)
    amount += Math.floor(amount * 0.02);
    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    // Stripe Gateway Initialization
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    // Create line-items for stripe
    const line_items = productData.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
        },
        quantity: item.quantity,
      };
    });

    // Create session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.json({
      success: true,
      url: session.url,
    });
  } catch (err) {
    console.log("🔴 COMPLETE ERROR: ", err);
    res.json({ success: false, message: err.message });
  }
}

// Stripe WebHooks to verify PAYMENTS-ACTION
export async function stripeWebhooks(req, res) {
  // Stripe Gateway Initialization
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        // Getting Session MetaData
        const session = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });
        const { orderId, userId } = session.data[0].metadata;

        // Mark Payment As PAID
        await Order.findByIdAndUpdate(orderId, { isPaid: true });

        // Clear User Cart
        await User.findByIdAndUpdate(userId, { cartItems: {} });
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        // Getting Session MetaData
        const session = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });
        const { orderId } = session.data[0].metadata;
        await Order.findByIdAndDelete(orderId);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }
    res.json({received:true})
  }
}

// Get Individual Order by User ID
export async function getUserOrders(req, res) {
  try {
    //const userId = req.user._id; // ✅ Fix: get from authenticated user
    const userId = req.userId;
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
