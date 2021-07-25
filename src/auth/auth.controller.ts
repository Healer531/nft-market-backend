import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { TokenResponse } from '../core/models/auth';
import { User } from '../user/entities/user.entity';
import { LoginDto } from '../user/dtos/login.dto';
import { UserDto } from 'src/user/dtos/user.dto';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({ type: TokenResponse })
  @Post('login')
  async login(@Body() body: LoginDto) {
    let user = await this.authService.validateUser(body.walletAddress);
    if (!user) {
      user = await this.authService.createUser(body);
    }
    return this.authService.login(user);
  }
}
