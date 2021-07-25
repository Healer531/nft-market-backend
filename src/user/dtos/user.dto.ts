import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UserDto {
  @ApiProperty({ required: false })
  @IsUUID()
  readonly id?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  walletAddress?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  logoImageName?: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  favoriteNfts: string[];
}
