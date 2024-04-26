import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDTO } from './dto/signup.dto';
import { loginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: signUpDTO): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  login(@Body() loginDto: loginDTO): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }
}
