import { IsEmail, IsString } from "class-validator";

export class UserValidationDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
