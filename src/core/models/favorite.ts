import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export interface Favorite {
  isFavorite: boolean;
  countOfUsers: number;
}
