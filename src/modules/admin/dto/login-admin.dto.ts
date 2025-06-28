import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({ example: 'admin' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'admin' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
