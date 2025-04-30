import jwt from "jsonwebtoken";
import { secretKey, tokenExpiration } from "../constant";

interface User {
  _id: string;
  email: string;
}

const generateToken = async (user: User): Promise<string> => {
  const payload = {
    id: user._id,
    email: user.email,
  };

  return jwt.sign(payload, secretKey, { expiresIn: tokenExpiration });
};

export { generateToken, secretKey };
