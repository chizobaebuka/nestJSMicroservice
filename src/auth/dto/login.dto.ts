import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class loginDTO {
  @IsEmail({}, { message: 'Please enter a valid email' })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
