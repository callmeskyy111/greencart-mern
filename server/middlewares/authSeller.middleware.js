import jwt from "jsonwebtoken";

export default async function authSeller(req, res, next) {
  const { sellerToken } = req.cookies;
  if (!sellerToken) {
    return res.json({ success: false, message: "Not Authorized 🔴" });
  }
  try {
    const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
    if (tokenDecode.email === process.env.SELLER_EMAIL) {
      next();
    } else {
      return res.json({ success: false, message: "Not Authorized 🔴" });
    }
  } catch (err) {
    console.log("🔴 ERROR: ", err);
    res.json({ success: false, message: err.message });
  }
}
