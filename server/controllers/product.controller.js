import { v2 as cloudinary } from "cloudinary";
import Product from "../models/product.model.js";

// Add product
export async function addProduct(req, res) {
  try {
    let productData = JSON.parse(req.body.productData);
    const images = req.files;
    let imagesURL = await Promise.all(
      images.map(async (img) => {
        let result = await cloudinary.uploader.upload(img.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );
    await Product.create({ ...productData, image: imagesURL });
    res.json({ success: true, message: "Product Added Successfully ✅" });
  } catch (err) {
    console.log("🔴 COMPLETE ERROR: ", err);
    res.json({ success: false, message: err.message });
  }
}

// Get Product List
export async function productList(_, res) {
  try {
    const products = await Product.find({}); //{} - All the products
    res.json({ success: true, message: "Product-list fetched ✅", products });
  } catch (err) {
    console.log("🔴 COMPLETE ERROR: ", err);
    res.json({ success: false, message: err.message });
  }
}

// Get single product (by ID)
export async function getSingleProduct(req, res) {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.json({ success: true, message: "Fetched Product By ID ☑️", product });
  } catch (err) {
    console.log("🔴 COMPLETE ERROR: ", err);
    res.json({ success: false, message: err.message });
  }
}

// Change Product inStock
export async function changeStock(req, res) {
  try {
    const { id, inStock } = req.body;
    await Product.findByIdAndUpdate(id, { inStock });
    res.json({ success: true, message: "STOCK updated ☑️" });
  } catch (err) {
    console.log("🔴 COMPLETE ERROR: ", err);
    res.json({ success: false, message: err.message });
  }
}
