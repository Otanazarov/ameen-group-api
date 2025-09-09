import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsArray, IsNotEmpty } from 'class-validator';

export class UpdateSubscriptionTypeDto {
  @ApiPropertyOptional({ example: 25000 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ example: 'Premium 1 oylik' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Premium kontent uchun 1 oylik obuna' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  expireDays?: number;


  @ApiPropertyOptional({ example: [101001, 101002] })
  @IsOptional()
  @IsArray()
  telegramTopicIds?: number[];
}
