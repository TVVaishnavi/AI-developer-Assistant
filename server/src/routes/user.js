const express = require("express")
const {createUser, login} = require("../controller/user")
const router = express.Router()
const cors = require("cors")
const {googleLoginController} = require("../controller/google")
const { generateCode } = require("../controller/openaiController")

router.use(cors())
router.post("/register", createUser)
router.post("/user/login", login);
router.post("/google/login", googleLoginController)


module.exports = router;