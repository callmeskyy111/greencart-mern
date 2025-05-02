import { Router } from "express";
import {
  addProduct,
  changeStock,
  getSingleProduct,
  productList,
} from "../controllers/product.controller.js";
import authSeller from "../middlewares/authSeller.middleware.js";
import { upload } from "../configs/multer.config.js";

const productRouter = Router();

//end-points
productRouter.post("/add", upload.array([images]), authSeller, addProduct);
productRouter.get("/list", productList);
productRouter.get("/id", getSingleProduct);
productRouter.post("/stock", authSeller, changeStock);

export default productRouter;
