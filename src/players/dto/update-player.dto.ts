import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePlayerDTO {
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
