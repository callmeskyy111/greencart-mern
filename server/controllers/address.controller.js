import Address from "../models/address.model.js";

// Add Address
export async function addAddress(req, res) {
  try {
    const { address, userId } = req.body;
    await Address.create({ ...address, userId });
    res.json({ success: true, message: "Address added successfully! ✅📍" });
  } catch (err) {
    console.log("🔴 COMPLETE ERROR: ", err);
    res.json({ success: false, message: err.message });
  }
}

// Get Address
export async function getAddress(req, res) {
  try {
    const { userId } = req.body;
    const addresses = await Address.find({ userId });
    res.json({
      success: true,
      message: "Addresses fetched successfully! ✅📍",
      addresses,
    });
  } catch (err) {
    console.log("🔴 COMPLETE ERROR: ", err);
    res.json({ success: false, message: err.message });
  }
}
