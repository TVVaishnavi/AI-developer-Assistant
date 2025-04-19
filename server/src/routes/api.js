const express = require("express");
const router = express.Router()
const {generateCode, getUserPrompts} = require("../controller/openaiController")
const {authenticateToken } = require("../middleware/authentication")

router.post("/generate", authenticateToken,generateCode);
router.post("/history", authenticateToken, getUserPrompts)

module.exports = router 