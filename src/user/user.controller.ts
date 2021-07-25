import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserDto } from './dtos/user.dto';
import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from '../utils/file-upload.utils';
import { Nft } from '../nft/entities/nft.entity';

@ApiTags('User')
@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Post('users')
  @ApiOkResponse({ type: User })
  async create(@Request() request, @Body() body: UserDto): Promise<User> {
    const user = await this.userService.createUser(body);
    return user;
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Post('updateProfile')
  @UseInterceptors(
    FileInterceptor('logoImage', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
    }),
  )
  async updateProfile(@UploadedFile() file, @Body() body) {
    let fileName = '';
    if (file) {
      fileName = file.filename;
    }
    const updatedUser = await this.userService.updateUser(body, fileName);
    return updatedUser;
  }

  @Get('/:walletAddress')
  async getUserByWalletAddress(
    @Param('walletAddress') walletAddress,
  ): Promise<User> {
    const user = await this.userService.findUserByWalletAddress(walletAddress);
    return user;
  }

  @Get('logo/:logoImageName')
  seeUploadedFile(@Param('logoImageName') logoImageName, @Res() res) {
    return res.sendFile(logoImageName, { root: './files' });
  }
}
