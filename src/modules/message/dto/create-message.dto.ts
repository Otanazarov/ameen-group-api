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
import { Type } from 'class-transformer';
import { ButtonPlacementDto } from './button-placement.dto';

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

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  fileIds?: number[];

  @ApiPropertyOptional({ type: [ButtonPlacementDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ButtonPlacementDto)
  buttonPlacements?: ButtonPlacementDto[];
}
