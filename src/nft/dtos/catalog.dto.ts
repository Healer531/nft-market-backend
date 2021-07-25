import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CatalogDto {
  @ApiProperty({ required: false })
  @IsUUID()
  readonly id?: string;

  @ApiProperty()
  @IsString()
  keyWord: string;

  @ApiProperty()
  @IsNotEmpty()
  priceRage: number[];

  @ApiProperty()
  @IsNotEmpty()
  categories: string[];

  @ApiProperty()
  @IsNumber()
  offset: number;

  @ApiProperty()
  @IsNumber()
  limit: number;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
