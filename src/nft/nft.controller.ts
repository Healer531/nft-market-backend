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
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { Express } from 'express';

import { NftService } from './nft.service';
import { Nft } from './entities/nft.entity';
import { NftDto } from './dtos/nft.dto';
import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { diskStorage } from 'multer';
import { editFileName } from '../utils/file-upload.utils';
import { TokenResponse } from '../core/models/auth';
import { LoginDto } from '../user/dtos/login.dto';
import { User } from '../user/entities/user.entity';
import { UserDto } from '../user/dtos/user.dto';
import { CatalogDto } from './dtos/catalog.dto';
import { Favorite } from '../core/models/favorite';
import * as Web3 from 'web3';

@ApiTags('Nft')
@Controller('api/nft')
export class NftController {
  ropstenNetworkUrl =
    'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
  web3 = null;
  constructor(private nftService: NftService) {
    this.web3 = new (Web3 as any)(
      new (Web3 as any).providers.HttpProvider(this.ropstenNetworkUrl),
    );
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Post('singleUpload')
  @UseInterceptors(
    FilesInterceptor('logoImage', 2, {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
    }),
  )
  async uploadNft(@UploadedFiles() files, @Body() body) {
    const nft = {
      nftName: body.nftName,
      creator: body.creator,
      owner: body.owner,
      category: body.category,
      royalty: body.royalty,
      description: body.description,
      price: body.price,
      logoImageName: files[0].filename,
      nftFileName: files[1].filename,
      favoriteUsers: [],
    };
    const createdNft = await this.nftService.createNft(nft);
    const hashId = createdNft.id;
    const messageHash = this.web3.eth.accounts.sign(
      String(hashId),
      '0f470614ddcc7219f312173107a25301f17ab99f94768405b33f3cdab19da345',
    );
    return { createdNft: createdNft, signedMessage: messageHash };
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Post('filter')
  async filterNft(@Body() body: CatalogDto): Promise<[Nft[], number]> {
    const result = await this.nftService.filterByCatalog(body);
    return result;
  }

  @Post('/update/:id')
  async updatePriceOfNFT(@Param('id') nftId, @Body() body): Promise<Nft> {
    const { sellType, price } = body;
    const result = await this.nftService.updatePriceOfNFT(
      nftId,
      sellType,
      price,
    );
    return result;
  }

  @Post('/sell-type/:id')
  async updateSellTypeOfNFT(@Param('id') nftId, @Body() body): Promise<Nft> {
    const { sellType } = body;
    const result = await this.nftService.updateSellTypeOfNFT(nftId, sellType);
    return result;
  }

  @Post('/owner/:id')
  async updateOwnerOfNFT(@Param('id') nftId, @Body() body): Promise<Nft> {
    const { owner } = body;
    console.log(nftId, owner);
    const result = await this.nftService.updateOwnerOfNFT(nftId, owner);
    return result;
  }

  @Get('/:id')
  async getNftById(@Param('id') nftId): Promise<Nft> {
    const result = await this.nftService.findNftById(nftId);
    return result;
  }

  @Get('id/getMaxId')
  async getMaxId(@Request() request) {
    const result = await this.nftService.getMaxId();
    return result;
  }

  @Post('favorites')
  async addOrRemoveFavorite(@Body() body: any): Promise<Favorite> {
    const nftId = body.nftId;
    const walletAddress = body.walletAddress;
    const status = body.status;
    const result = await this.nftService.addOrRemoveFavorite(
      nftId,
      walletAddress,
      status,
    );
    return result;
  }

  @Get('logo/:logoImageName')
  seeUploadedFile(@Param('logoImageName') logoImageName, @Res() res) {
    return res.sendFile(logoImageName, { root: './files' });
  }
}
