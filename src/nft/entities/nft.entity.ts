import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn, ManyToMany, JoinTable
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../user/entities/user.entity';

@Entity('nft')
export class Nft {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  nftName: string;

  @ApiProperty()
  @Column()
  creator: string;

  @ApiProperty()
  @Column()
  owner: string;

  @ApiProperty()
  @Column()
  category: string;

  @ApiProperty()
  @Column()
  royalty: number;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  logoImageName: string;

  @ApiProperty()
  @Column()
  nftFileName: string;

  @ApiProperty()
  @Column({ nullable: true })
  sellType: string;

  @ApiProperty()
  @Column({ nullable: true, type: 'float' })
  price: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToMany(() => User, (user) => user.favoriteNfts)
  @JoinTable()
  favoriteUsers: User[];
}
