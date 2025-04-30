import { IsEmail, IsNotEmpty, Length, validate } from "class-validator";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constant";
import * as userService from "../service/user";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

class UserDto {
  @IsNotEmpty({ message: ERROR_MESSAGES.MISSING_FIELDS })
  @Length(3, 50, { message: "Name must be between 3 and 50 characters." })
  name: string;

  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsNotEmpty({ message: ERROR_MESSAGES.MISSING_FIELDS })
  @Length(6, 100, { message: "Password must be at least 6 characters long." })
  password: string;
}

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    
    const userDto = new UserDto();
    userDto.name = name;
    userDto.email = email;
    userDto.password = password;

    const errors = await validate(userDto); 
    if (errors.length > 0) {
     res.status(400).json({ message: errors[0].constraints });
    }

    if (!email || !password || !name) {
     res.status(400).json({ message: ERROR_MESSAGES.MISSING_FIELDS });
    }

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser !== null) {
     res.status(400).json({ message: ERROR_MESSAGES.EMAIL_EXISTS });
    }

    await userService.createUser({ name, email, password });

   res.status(201).json({ message: SUCCESS_MESSAGES.USER_CREATED });
  } catch (error) {
    console.error("Error creating user:", error);
   res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
     res.status(400).json({ message: ERROR_MESSAGES.MISSING_FIELDS });
    }

    const user = await userService.login(email);
    if (!user) {
     res.status(401).json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
    }

    const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });

   res.json({ message: SUCCESS_MESSAGES.LOGIN_SUCCESSFUL, result: user, token });
  } catch (err) {
    if (err instanceof Error && (err.message === ERROR_MESSAGES.INVALID_CREDENTIALS || err.message === "invalid token")) {
     res.status(401).json({ message: err.message });
    }
    console.error(err);
   res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
     res.status(400).json({ message: ERROR_MESSAGES.TOKEN_REQUIRED });
    }

    const newToken = await userService.refreshToken(token);
    if (!newToken) {
     res.status(401).json({ message: ERROR_MESSAGES.INVALID_TOKEN });
    }

   res.json({ token: newToken });
  } catch (err) {
    if (err instanceof Error && err.message === "invalid token") {
     res.status(401).json({ message: ERROR_MESSAGES.INVALID_TOKEN });
    }
    console.error(err);
   res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }  
};
