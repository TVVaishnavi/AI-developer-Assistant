import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/database";

import openaiRoutes from "./routes/api";
import userRoute from "./routes/user";

dotenv.config();

const PORT = process.env.PORT || 4500;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ai", openaiRoutes, userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
