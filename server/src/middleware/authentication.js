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

const verifyToken = (token)=>{
    return jwt.verify(token,secretKey)
}
module.exports = {authenticateToken, verifyToken}