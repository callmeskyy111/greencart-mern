import { Router } from "express";
import { updateCart } from "../controllers/cart.controller.js";
import authUser from "../middlewares/authUser.middleware.js";

const cartRouter = Router();

cartRouter.post("/update", authUser, updateCart);

export default cartRouter;
