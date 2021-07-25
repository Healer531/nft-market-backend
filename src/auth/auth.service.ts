import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { TokenResponse } from '../core/models/auth';
import { LoginDto } from '../user/dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(walletString: string): Promise<User> {
    const user = await this.userService.findUserByWalletAddress(walletString);
    if (user) {
      return user;
    }
    return null;
  }

  async createUser(payload: LoginDto): Promise<User> {
    const user = {
      walletAddress: payload.walletAddress,
      userName: '',
      logoImageName: '',
    };
    const createdUser = await this.userService.createUser(user);
    if (createdUser) {
      return createdUser;
    }
    return null;
  }

  async login(user: User): Promise<TokenResponse> {
    const payload = {
      walletAddress: user.walletAddress,
      id: user.id,
    };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async findUserByWalletAddress(walletAddress: string): Promise<User> {
    return this.userService.findUserByWalletAddress(walletAddress);
  }
}
