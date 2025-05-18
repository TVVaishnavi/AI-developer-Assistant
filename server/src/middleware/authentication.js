const jwt = require("jsonwebtoken")
const {secretKey}=require('../config/jwtToken')
const express = require('express')
const app = express()

app.use(express.json())
require('dotenv').config()


const authenticateToken = async (req, res, next) => {
    if (process.env.NODE_ENV === "test") {
        return next(); 
    }

    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized: Missing Token" });
    }

    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
        req.user = user;
        next();
    });
};

const authenticateTokenOptional = (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log("Incoming Authorization Header:", authHeader);

    const parts = authHeader ? authHeader.split(" ") : [];
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        console.log("No valid token provided. req.user set to null.");
        req.user = null;
        return next();
    }

    const token = parts[1];
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.log("Invalid token:", err.message);
            req.user = null;
        } else {
            console.log("Decoded JWT payload:", user);
            req.user = user; // Ensure the decoded user object is assigned here
        }
        next();
    });
};

const verifyToken = (token)=>{
    return jwt.verify(token,secretKey)
}
module.exports = {authenticateToken, verifyToken, authenticateTokenOptional}