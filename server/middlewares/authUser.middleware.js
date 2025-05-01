import jwt from "jsonwebtoken";

// Checking whether user is logged-in or not.
export default async function authUser(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    return res.json({ success: false, message: "Not Authorized 🔴" });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {
      req.userId = tokenDecode.id; // ✅ Use req.userId (NOT req.body.userId)
      next();
    } else {
      return res.json({ success: false, message: "Not Authorized 🔴" });
    }
  } catch (err) {
    console.log('🔴 ERROR: ',err)
    res.json({ success: false, message: err.message });
  }
}
