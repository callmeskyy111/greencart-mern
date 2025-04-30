import express from "express";
import "dotenv/config.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./configs/db.js";

const app = express();
const port = process.env.PORT || 4000;

await connectDb();

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

app.get("/", (_, res) => {
  res.send("<h2>🛒 GreenCart BACKEND API ✅</h2>");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port} 🛜`);
});
