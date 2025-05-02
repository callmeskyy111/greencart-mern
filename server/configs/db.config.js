import mongoose from "mongoose";

export default async function connectDb() {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Connected to MongoDB ✅")
    );
    await mongoose.connect(`${process.env.MONGODB_URI}/greencart-mern`);
  } catch (err) {
    console.log("🔴 ERROR connecting to DB:", err.message);
    process.exit(1);
  }
}
