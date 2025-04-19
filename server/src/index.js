require('dotenv').config();
require("./config/dataBase")
const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 4500;
const app = express();

app.use(cors());
app.use(express.json());
const openaiRoutes = require("./routes/api");
const userRoutes = require("./routes/user");
app.use("/api/ai", openaiRoutes, userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
