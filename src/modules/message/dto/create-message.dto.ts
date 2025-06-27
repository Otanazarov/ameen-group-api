import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserStatus } from '@prisma/client';

export class CreateMessageDto {
  @ApiProperty({ example: 'Salom, qanday yordam bera olaman?' })
  @IsString()
  text: string;

  @ApiPropertyOptional({ example: new Date() })
  @IsOptional()
  @IsDateString()
  sendTime?: Date;

  @ApiPropertyOptional({ example: [1, 2, 3] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  userIds?: number[];

  @ApiPropertyOptional({ example: 'REGISTERED' })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  subscriptionTypeId?: number;
}
