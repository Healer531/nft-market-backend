import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { getFromDto } from '../core/utils/repository.util';
import { throwError } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(body: any, throwError = true): Promise<User> {
    const found = await this.findUserByWalletAddress(body.walletAddress);
    if (found) {
      if (throwError) {
        throw new BadRequestException(`WalletAddress is already.`);
      } else {
        return found;
      }
    }
    const user = getFromDto<User>(body, new User());

    const added = await this.userRepository.save(user);
    return this.findUserByWalletAddress(added.walletAddress);
  }

  async updateUser(body: any, logoImageName: string): Promise<User> {
    const user = await this.findUserByWalletAddress(body.walletAddress);
    if (!user) {
      if (throwError) {
        throw new BadRequestException(`WalletAddress does not exist.`);
      } else {
        return user;
      }
    }
    user.userName = body.userName;
    if (logoImageName) {
      user.logoImageName = logoImageName;
    }
    await this.userRepository.save(user);
    return this.findUserById(user.id);
  }

  async findUsers(
    skip: number,
    take: number,
    keyword = '',
  ): Promise<[User[], number]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.firstName ilike :keyword', { keyword: `%${keyword}%` })
      .orWhere('user.lastName ilike :keyword', { keyword: `%${keyword}%` })
      .addOrderBy('user.createdAt', 'ASC')
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  findUserByWalletAddress(
    walletAddress: string,
    findRemoved = false,
  ): Promise<User> {
    if (!walletAddress) {
      return null;
    }
    return this.userRepository.findOne({
      withDeleted: findRemoved,
      where: { walletAddress: walletAddress.toLowerCase() },
    });
  }

  async findUserById(id: number, findRemoved = false): Promise<User> {
    const user = await this.userRepository.findOne({
      withDeleted: findRemoved,
      where: {
        id,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  count(): Promise<number> {
    return this.userRepository.count();
  }
}
