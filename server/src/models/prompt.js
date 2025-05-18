const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema({
  userPrompt: {
    type: String,
    required: true,
  },
  aiResponse: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, 
  },
  email: {
    type: String,
    default: null, 
  },
  userType: {
    type: String,
    enum: ["user", "guest"],
    default: "guest",
  },
  chatId: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Prompt", promptSchema);
