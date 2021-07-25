import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TokenResponse {
  @ApiProperty()
  @IsString()
  readonly accessToken: string;

  constructor(token: string) {
    this.accessToken = token;
  }
}
