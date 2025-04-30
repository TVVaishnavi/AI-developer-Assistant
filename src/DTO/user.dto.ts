import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsString()
  @Length(3, 30, { message: "Name must be between 3 and 30 characters" })
  name!: string;

  @IsEmail({}, { message: "Invalid email format" })
  email!: string;

  @IsString()
  @Length(6, 20, { message: "Password must be between 6 and 20 characters" })
  password!: string;
}

export class LoginUserDto {
  @IsEmail({}, { message: "Invalid email format" })
  email!: string;

  @IsString()
  @Length(6, 20, { message: "Password must be between 6 and 20 characters" })
  password!: string;
}

export class RefreshTokenDto {
  @IsString({ message: "Token must be a string" })
  token!: string;
}
