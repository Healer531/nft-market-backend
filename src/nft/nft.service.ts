import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Nft } from './entities/nft.entity';
import { User } from '../user/entities/user.entity';
import { getFromDto } from '../core/utils/repository.util';
import { CatalogDto } from './dtos/catalog.dto';
import { Favorite } from '../core/models/favorite';

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(Nft)
    private readonly nftRepository: Repository<Nft>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createNft(body: any, throwError = true): Promise<Nft> {
    const found = await this.findNftByName(body.nftName);
    if (found) {
      throw new BadRequestException('NFT is already exist.');
    }
    const newNft = getFromDto<Nft>(body, new Nft());
    const added = await this.nftRepository.save(newNft);
    return added;
  }

  async findNftById(id: string): Promise<Nft> {
    const nft = await this.nftRepository.findOne({
      where: {
        id,
      },
    });
    if (!nft) {
      throw new BadRequestException('Could not find requested client.');
    }
    return nft;
  }

  async findNftByName(nftName: string): Promise<Nft> {
    const nft = await this.nftRepository.findOne({
      where: {
        nftName,
      },
    });
    return nft;
  }

  async getMaxId(): Promise<number> {
    const count = await this.nftRepository.count();
    return count;
  }

  async addOrRemoveFavorite(
    nftId: number,
    walletAddress: string,
    status: boolean,
  ): Promise<Favorite> {
    const nft = await this.nftRepository.findOne({
      relations: ['favoriteUsers'],
      where: {
        id: nftId,
      },
    });
    const user = await this.userRepository.findOne({
      where: {
        walletAddress,
      },
    });
    let indexOfUser = -1;
    nft.favoriteUsers.forEach((itemUser, index) => {
      if (itemUser.id === user.id) {
        indexOfUser = index;
      }
    });
    let isFavorite = false;
    let count: number = nft.favoriteUsers.length;
    if (indexOfUser < 0) {
      isFavorite = false;
    } else {
      isFavorite = true;
    }
    if (!status) {
      if (indexOfUser < 0) {
        nft.favoriteUsers.push(user);
        isFavorite = true;
        count = count + 1;
      } else {
        nft.favoriteUsers.splice(indexOfUser);
        isFavorite = false;
        count = count - 1;
      }
    }
    const updated = await this.nftRepository.save(nft);
    const result: Favorite = { isFavorite: isFavorite, countOfUsers: count };
    return result;
  }

  async updateSellTypeOfNFT(id: string, sellType: string): Promise<Nft> {
    const nft = await this.nftRepository.findOne({
      where: {
        id,
      },
    });
    if (!nft) {
      throw new BadRequestException('Could not find requested client.');
    }
    nft.sellType = sellType;
    const updated = await this.nftRepository.save(nft);
    return updated;
  }

  async updatePriceOfNFT(
    id: string,
    sellType: string,
    price: number,
  ): Promise<Nft> {
    const nft = await this.nftRepository.findOne({
      where: {
        id,
      },
    });
    if (!nft) {
      throw new BadRequestException('Could not find requested client.');
    }
    nft.sellType = sellType;
    nft.price = price;
    const updated = await this.nftRepository.save(nft);
    return updated;
  }

  async updateOwnerOfNFT(id: string, owner: string): Promise<Nft> {
    const nft = await this.nftRepository.findOne({
      where: {
        id,
      },
    });
    if (!nft) {
      throw new BadRequestException('Could not find requested client.');
    }
    nft.owner = owner;
    const updated = await this.nftRepository.save(nft);
    return updated;
  }

  async filterByCatalog(catalog: CatalogDto): Promise<[Nft[], number]> {
    const filetResult = await this.nftRepository
      .createQueryBuilder('nft')
      .where('nft.nftName ilike :keyword', { keyword: `%${catalog.keyWord}%` })
      .andWhere('nft.category IN (:...categories) ', {
        categories: catalog.categories,
      })
      // .andWhere('nft.price BETWEEN :min AND :max', {
      //   min: catalog.priceRage[0],
      //   max: catalog.priceRage[0],
      // })
      .addOrderBy('nft.createdAt', 'ASC')
      .offset(catalog.offset)
      .limit(catalog.limit)
      .getManyAndCount();
    return filetResult;
  }

  count(): Promise<number> {
    return this.nftRepository.count();
  }
}
