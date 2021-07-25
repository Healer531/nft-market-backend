import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { IsOptional, IsString } from 'class-validator';
import { Nft } from '../../nft/entities/nft.entity';

@Entity('user')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  @Column({ default: '', nullable: true })
  userName: string;

  @ApiProperty()
  @Column()
  walletAddress: string;

  @ApiProperty()
  @Column({ default: '', nullable: true })
  logoImageName: string;

  @ManyToMany(() => Nft, (nft) => nft.favoriteUsers)
  favoriteNfts: Nft[];
}
