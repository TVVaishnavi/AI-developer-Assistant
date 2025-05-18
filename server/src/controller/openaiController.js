const OpenAI = require('openai');
const Prompt = require("../models/prompt");
const { isValidPrompt } = require("../utility/filterPrompt");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const generateCode = async (req, res) => {
  const { prompt, chatId } = req.body;
  const user = req.user;
  const io = req.io;
  const userId = user?.userId || null;
  const email = user?.email || null;
  const userType = userId ? "user" : "guest";

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt must be a valid string" });
  }

  if (!isValidPrompt(prompt)) {
    return res.status(400).json({ error: "Only code-related prompts are allowed" });
  }

  try {
    const finalChatId = chatId || `chat-${Date.now()}`;
    const previousMessages = await Prompt.find({chatId: finalChatId}).sort({createdAt:1})
    const messages = [
      { role: "system", content: "You are a helpful assistant..." },
      ...previousMessages.map((m) => ({ role: "user", content: m.userPrompt })),
      { role: "user", content: prompt },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
    });


    const aiResponse = response.choices[0].message.content;

    
    const savedPrompt = await Prompt.create({
      userId,
      email,
      userType,
      userPrompt: prompt,
      aiResponse,
      chatId: finalChatId,
    });
    console.log(`Prompt saved to DB for ${userType}${userId ? `: ${userId}` : ""}`);

    if (io) {
      io.emit("PromptGenerated", {
        userId,
        userPrompt: prompt,
        aiResponse,
        id: savedPrompt._id,
        chatId: savedPrompt.chatId,
      })
    }
    res.json({ output: aiResponse, chatId: finalChatId });

  } catch (error) {
    console.error("OpenAI Error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getUserPrompts = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: Only registered users can view saved prompts." });
    }

    const prompts = await Prompt.find({ userId: user.userId }).sort({ createdAt: -1 });
    res.json({ prompts });

  } catch (error) {
    console.error("Error fetching user prompts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUserPrompt = async (req, res) => {
  try {
    const user = req.user;
    const io = req.io;
    const { id } = req.params;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: Only registered users can delete prompts." });
    }

    const prompt = await Prompt.findOne({ _id: id, userId: user.userId });

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found or not authorized" });
    }

    await Prompt.findByIdAndDelete(id);
    console.log("Received DELETE for ID:", req.params.id);

    if (io) {
      io.emit("PromptDeleted", { id });
    }

    res.status(200).json({ message: "Prompt deleted successfully" });

  } catch (error) {
    console.error("Error deleting prompt:", error);
    res.status(500).json({ message: "Internal server error" });
  }

};

const editAndRegeneratePrompt = async (req, res) => {
  try {
    const user = req.user;
    const io = req.io;
    const { id } = req.params;
    const { editedPrompt } = req.body;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: Only registered users can edit prompts." });
    }

    if (!editedPrompt || typeof editedPrompt !== "string") {
      return res.status(400).json({ error: "Edited prompt must be a valid string" });
    }

    if (!isValidPrompt(editedPrompt)) {
      return res.status(400).json({ error: "Only code-related prompts are allowed" });
    }


    const promptDoc = await Prompt.findOne({ _id: id, userId: user.userId });
    if (!promptDoc) {
      return res.status(404).json({ message: "Prompt not found or not authorized" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant that returns frontend code based on the user's prompt" },
        { role: "user", content: editedPrompt },
      ],
      temperature: 0.7,
    });

    const regeneratedResponse = response.choices[0].message.content;

    promptDoc.userPrompt = editedPrompt;
    promptDoc.aiResponse = regeneratedResponse;
    await promptDoc.save();

    if (io) {
      io.emit("PromptUpdated", {
        id: promptDoc._id,
        userPrompt: editedPrompt,
        aiResponse: regeneratedResponse,
      })
    }

    res.json({ output: regeneratedResponse });

  } catch (error) {
    console.error("Error editing/regenerating prompt:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSharedPrompt = async (req, res) => {
  const { id } = req.params;
  try {
    const prompt = await Prompt.findById(id)
    if (!prompt) return res.status(400).json({ error: 'prompt not found' })

    prompt.shared = true;
    await prompt.save();

    res.json({
      success: true,
      shareUrl: `${req.protocol}://${req.get('host')}/result/${id}`,
    })
  } catch (error) {
    console.error('Error while sharing prompt:', error);
    res.status(500).json({ error: 'Failed to fetch shared prompt' })
  }
}

const renamePrompt = async (req, res) => {
  try {
    const { id } = req.params;
    const { newName } = req.body;

    if (!newName || typeof newName !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid new name' });
    }

    const prompt = await Prompt.findById(id);
    if (!prompt) {
      return res.status(404).json({ success: false, message: 'Prompt not found' });
    }

    prompt.userPrompt = newName;
    await prompt.save();

    res.json({ success: true, message: 'Prompt renamed successfully' });
  } catch (err) {
    console.error('Rename error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

const visit = async (req, res) => {
  const { id } = req.params;
  try {
    const prompt = await Prompt.findById(id);
    if (!prompt) return res.status(404).send("prompt not found");

    res.status(200).json({
      userPrompt: prompt.userPrompt,
      aiResponse: prompt.aiResponse,
    });
  } catch (error) {
    console.error('Error fetching shared prompt:', error);
    res.status(500).send('Internal Server Error');
  }
}


module.exports = {
  generateCode, getSharedPrompt, renamePrompt,
  getUserPrompts, deleteUserPrompt, editAndRegeneratePrompt, visit
};