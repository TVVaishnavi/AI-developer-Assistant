const crypto = require("crypto");
const jwt = require("jsonwebtoken")

const secretKey = process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");

const generateToken = async (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role
  };
  const token = jwt.sign(payload, secretKey, { expiresIn: "24h" });
  return token;
};

module.exports = { generateToken, secretKey }
