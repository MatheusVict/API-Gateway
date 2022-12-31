import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePlayerDTO {
  /*@IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;*/

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  category?: string;

  @IsOptional()
  urlPicPlayer?: string;
}
