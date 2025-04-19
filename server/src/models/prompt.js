const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema({
  userPrompt: String,
  aiResponse: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Prompt", promptSchema);
