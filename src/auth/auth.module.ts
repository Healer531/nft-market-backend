import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../user/user.module';

import { JwtStrategy } from '../core/guards/jwt.strategy';
import { jwtConstant } from '../core/constants/base.constant';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstant.secret,
      signOptions: { expiresIn: jwtConstant.expiresIn },
    }),
    UserModule,
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
