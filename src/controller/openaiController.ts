import { Request, Response } from 'express';
import OpenAI from 'openai';
import Prompt from "../models/prompts";
import { openaiApiKey, openaiModel, systemRoleContent, temperature } from "../constant";  // Importing from constants.ts
import { validate } from 'class-validator';  // Import validate function
import { GenerateCodeRequest } from "../DTO/request.dto";  // Import DTO class

const openai = new OpenAI({
  apiKey: openaiApiKey
});

export const generateCode = async (req: Request, res: Response): Promise<void> => {
  const { prompt } = req.body;

  // Create a DTO instance and populate it with the request body
  const generateCodeDto = new GenerateCodeRequest();
  generateCodeDto.prompt = prompt;

  // Validate the DTO
  const errors = await validate(generateCodeDto);

  if (errors.length > 0) {
    // If validation fails, return 400 status with errors
    res.status(400).json({
      message: "Validation failed",
      errors: errors.map(error => ({
        property: error.property,
        constraints: error.constraints,
      })),
    });
    return;
  }

  try {
    const response = await openai.chat.completions.create({
      model: openaiModel,
      messages: [
        {
          role: "system",
          content: systemRoleContent,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: temperature,
    });

    const aiResponse: string = response.choices[0].message.content ?? "No content available";
    await Prompt.create({ userPrompt: prompt, aiResponse });

    res.json({ output: aiResponse });
  } catch (error: any) {
    console.error("OpenAI Error: ", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};
