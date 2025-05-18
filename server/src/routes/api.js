const express = require("express");
const router = express.Router()
const {generateCode, getUserPrompts, deleteUserPrompt, editAndRegeneratePrompt, visit, renamePrompt,getSharedPrompt} = require("../controller/openaiController")
const {authenticateToken, authenticateTokenOptional } = require("../middleware/authentication")

router.post("/generate", authenticateTokenOptional,generateCode);
router.get("/history", authenticateToken, getUserPrompts);
router.post ("/generate/nonusers", generateCode);
router.delete('/history/:id', authenticateToken, deleteUserPrompt);
router.put('/prompts/:id/edit', authenticateToken, editAndRegeneratePrompt);
router.put('/history/:id/rename', authenticateToken, renamePrompt);
router.post('/history/:id/share', authenticateToken, getSharedPrompt);
router.get('/result/:id', visit);

module.exports = router 