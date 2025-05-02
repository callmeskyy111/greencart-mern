import express from "express";
import cors from "cors";
import "dotenv/config.js";
import cookieParser from "cookie-parser";
import connectDb from "./configs/db.config.js";
import userRouter from "./routes/user.route.js";
import sellerRouter from "./routes/seller.route.js";
import productRouter from "./routes/product.route.js";
import connectCloudinary from "./configs/cloudinary.config.js";

const app = express();
const port = process.env.PORT || 4000;

// CONFIG F(X).
await connectDb();
await connectCloudinary();

// ALLOW MULTIPLE ORIGINS
const allowedOrigins = ["http://localhost:5173"];

//Middleware config.
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ROUTES
app.get("/", (_, res) => {
  res.send("<h2>🛒 GreenCart BACKEND API ✅</h2>");
});

app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port} 🛜`);
});

//todo: - 07:00:45
