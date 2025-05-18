require("dotenv").config();
require("./config/dataBase");

const express = require("express");
const http = require('http');
const {Server} = require('socket.io');
const cors = require("cors");
const path = require("path"); 

const PORT = process.env.PORT || 4500;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors:{
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true,
  }
})
module.exports = io; 
app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


const openaiRoutes = require("./routes/api");
const userRoutes = require("./routes/user");
app.use("/api/ai", (req, res, next)=>{
  req.io = io;
  next()
}, openaiRoutes, userRoutes);

io.on("connection", (socket)=>{
  console.log("New client connected", socket.id);

  socket.on("Send message", (message)=>{
    console.log("Received message:", message);
    io.emit("Receive message", message);
  })

  socket.on("disconnect", ()=>{
    console.log("Client disconnected", socket.id);
  })
})
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on ${PORT}`);
});