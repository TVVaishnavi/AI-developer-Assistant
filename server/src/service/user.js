const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwtToken = require("../config/jwtToken");
const jwt = require("jsonwebtoken");

const getUsers = async () => {
  return await User.find({});
};

const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const createUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await new User({ name, email, password: hashedPassword }).save();
};

const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = await jwtToken.generateToken(user);
    return {
      email: user.email,
      name: user.name,
      token,
    };
  } catch (error) {
    throw new Error(error.message || "Login failed");
  }
};

const refreshToken = async (oldToken) => {
  try {
    if (!oldToken) {
      throw new Error("Token is required");
    }

    const decoded = jwt.verify(oldToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error("User not found");
    }

    const newToken = await jwtToken.generateToken(user);
    return newToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new Error("Invalid or expired token");
    }
    throw new Error("Token refresh failed");
  }
};

module.exports = {
  getUsers,
  getUserByEmail,
  createUser,
  login,
  refreshToken,
};
