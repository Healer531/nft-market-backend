import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as OrmConfig from './orm.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { NftModule } from './nft/nft.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(OrmConfig),
    UserModule,
    AuthModule,
    NftModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
