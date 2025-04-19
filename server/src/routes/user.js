const express = require("express")
const {createUser, login} = require("../controller/user")
const router = express.Router()
const cors = require("cors")

router.use(cors())
router.post("/register", createUser)
router.post("/user/login", login);

module.exports = router;