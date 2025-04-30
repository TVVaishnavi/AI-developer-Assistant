// src/dto/GenerateCodeRequest.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateCodeRequest {
  @IsString()
  @IsNotEmpty()
  prompt!: string;
}
