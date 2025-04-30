import { User, IUser } from "../models/user";
import bcrypt from "bcrypt";
import { generateToken, secretKey } from "../config/jwtToken";
import jwt from "jsonwebtoken";
import { SALT_ROUNDS, ERRORS } from "../constant";
import { CreateUserDto, LoginUserDto, RefreshTokenDto } from "../DTO/user.dto";

const createUser = async (userDto: CreateUserDto): Promise<IUser> => {
  const { name, email, password } = userDto;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error(ERRORS.EMAIL_EXISTS);
  }
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();
  return newUser;
};

const login = async (loginDto: LoginUserDto): Promise<{
  _id: any; token: string 
}> => {
  const { email, password } = loginDto;
  const user = await User.findOne({ email }) as IUser;
  if (!user) {
    throw new Error(ERRORS.INVALID_CREDENTIALS);
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error(ERRORS.INVALID_CREDENTIALS);
  }
  const token = await generateToken(user.toObject());
  return { _id: user._id, token };
};

const getUsers = async (): Promise<IUser[]> => {
  return await User.find({});


};

const refreshToken = async (tokenDto: RefreshTokenDto): Promise<string> => {
  try {
    const decoded = jwt.verify(tokenDto.token, secretKey) as { id: string };
    const user = await User.findById(decoded.id) as IUser;
    if (!user) {
      throw new Error(ERRORS.USER_NOT_FOUND);
    }
    return generateToken(user as IUser);
  } catch (error) {
    console.log(error);
    throw new Error(ERRORS.INVALID_TOKEN);
  }
};

export { getUsers, createUser, login, refreshToken };

  export function getUserByEmail(email: any) {
    throw new Error("Function not implemented.", email);
  }

