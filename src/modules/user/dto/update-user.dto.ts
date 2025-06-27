import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { UserStatus } from '@prisma/client';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Otabek' })
  @IsOptional()
  @IsString()
  firsName?: string;

  @ApiPropertyOptional({ example: 'Otanazarov' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: '998901234567' })
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiPropertyOptional({})
  @IsOptional()
  @IsBoolean()
  inGroup?: boolean;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ example: 'username' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username?: string;

  @ApiPropertyOptional({ example: 'username' })
  @IsOptional()
  @IsDateString()
  lastActiveAt?: Date;
}
