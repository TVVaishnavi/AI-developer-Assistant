import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not defined in the environment variables.");
}

mongoose.connect(mongoUri, {
  tls: true,
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error(`MongoDB connection error: ${err}`);
});

export default mongoose;
