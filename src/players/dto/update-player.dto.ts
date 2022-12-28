import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreatePlayerDTO {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  category: string;
}
