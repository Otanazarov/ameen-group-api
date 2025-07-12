import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserStatus } from '@prisma/client';
import { InlineKeyboardDto } from './inline-keyboard.dto';
import { Type } from 'class-transformer';

export class CreateMessageDto {
  @ApiProperty({ example: 'Salom, qanday yordam bera olaman?' })
  @IsString()
  text: string;

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

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  @IsString()
  file?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  @IsString()
  video?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ type: InlineKeyboardDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => InlineKeyboardDto)
  buttons?: InlineKeyboardDto;
}
