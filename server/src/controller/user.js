const userService = require("../service/user");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const io = req.io;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = await userService.createUser({ name, email, password }); 

    if(io){
      io.emit("userRegistered", {
        name: newUser.name,
        email: newUser.email,
        id: newUser._id 
      })
    }

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const io = req.io;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userService.login(email, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if(io){
      io.emit("userLoggedIn",{
        name: user.name, 
        email: user.email,
      })
    }

    return res.json({
      token: user.token,
      name: user.name,
      email: user.email,
      status: true,
    });

  } catch (err) {
    if (err.message === "Invalid credentials" || err.message === "invalid token") {
      return res.status(401).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const refreshToken = async (req, res) => {
  try {
      const { token } = req.body;

      if (!token) {
          return res.status(400).json({ message: "Token is required" });
      }

      const newToken = await userService.refreshToken(token);
      if (!newToken) {
          return res.status(401).json({ message: "Invalid token" });
      }

      res.json({ token: newToken });
  } catch (err) {
      if (err.message === "invalid token") {
          return res.status(401).json({ message: "Invalid token" });
      }
      console.error(err); 
      res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  createUser,
  login,
  refreshToken,
};
