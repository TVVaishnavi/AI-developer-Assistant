const OpenAI = require('openai');
const Prompt = require("../models/prompt");
const { isValidPrompt } = require("../utility/filterPrompt");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const generateCode = async (req, res) => {
  const { prompt } = req.body;
  const userId = req.user ? req.user.userId : null;
  //console.log(req.user)

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: "Prompt must be a valid string" });
  }

  if (!isValidPrompt(prompt)) {
    return res.status(400).json({ error: "Only code related prompts are allowed" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that returns frontend code based on the user's prompt",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const aiResponse = response.choices[0].message.content;

    if (userId) {
      await Prompt.create({ userId, userPrompt: prompt, aiResponse });
    }

    res.json({ output: aiResponse });
  } catch (error) {
    console.error("OpenAI Error: ", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getUserPrompts = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const prompts = await Prompt.find({ userId }).sort({ createdAt: -1 });

    res.json({ prompts });
  } catch (error) {
    console.error("Error fetching user prompts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  generateCode,
  getUserPrompts,
};