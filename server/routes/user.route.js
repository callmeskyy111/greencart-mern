import { Router } from "express";
import {
  isAuth,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import authUser from "../middlewares/authUser.middleware.js";

const userRouter = Router();

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.get("/is-auth", authUser, isAuth);
userRouter.get("/logout", authUser, logoutUser);

export default userRouter;
