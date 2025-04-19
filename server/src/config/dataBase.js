const mongoose = require("mongoose")
require('dotenv').config()

const mongoUri = process.env.MONGODB_URI

mongoose.connect(mongoUri, {
    tls: true, 
    serverSelectionTimeoutMS: 5000,
})

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB")
})

mongoose.connection.on("error", (err) => {
    console.log(`MongoDB connection error: ${err}`)
})

module.exports = mongoose