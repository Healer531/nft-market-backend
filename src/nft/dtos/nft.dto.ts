import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator';

export class NftDto {
  @ApiProperty({ required: false })
  @IsUUID()
  readonly id?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nftName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  creator: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  owner: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  royalty: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sellType: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  logoFile: Express.Multer.File;

  @ApiProperty()
  @IsNotEmpty()
  nftFile: Express.Multer.File;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  favoriteUsers: string[];
}
