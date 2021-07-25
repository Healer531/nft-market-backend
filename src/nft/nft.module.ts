import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Nft } from './entities/nft.entity';

import { NftService } from './nft.service';
import { NftController } from './nft.controller';
import { MulterModule } from '@nestjs/platform-express';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nft, User]),
    MulterModule.register({ dest: './files' }),
  ],
  exports: [NftService],
  controllers: [NftController],
  providers: [NftService],
})
export class NftModule {}
