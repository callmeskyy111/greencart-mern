import jwt from "jsonwebtoken";

// login Seller
export async function loginSeller(req, res) {
  try {
    const { email, password } = req.body;
    if (
      password === process.env.SELLER_PASSWORD &&
      email === process.env.SELLER_EMAIL
    ) {
      //token generation
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "2d",
      });
      res.cookie("token", token, {
        httpOnly: true, // Prevent JS to access the cookie
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time in ms.
      });
      return res.json({
        success: true,
        message: "Seller/Admin Logged In ✅",
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid CREDENTIALS! 🔴",
      });
    }
  } catch (err) {
    console.log("🔴 COMPLETE ERROR: ", err);
    res.json({ success: false, message: err.message });
  }
}

// Auth. Seller
export async function isSellerAuth(_, res) {
  try {
    return res.json({ success: true });
  } catch (err) {
    console.log("🔴 COMPLETE ERROR: ", err);
    res.json({ success: false, message: err.message });
  }
}

// Logout Seller
export async function logoutSeller(_, res) {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Seller Logged Out! ✅" });
  } catch (err) {
    console.log("🔴 COMPLETE ERROR: ", err);
    res.json({ success: false, message: err.message });
  }
}
