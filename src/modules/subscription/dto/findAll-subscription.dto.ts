import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { IsId } from 'src/common/dtos/id.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
}

export class FindAllSubscriptionDto extends PaginationDto {
  @IsId(false)
  @IsOptional()
  userId?: number;

  @IsId(false)
  @IsOptional()
  subscriptionTypeId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDateFrom?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  minPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDateTo?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expireDateFrom?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expireDateTo?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  oneTime?: boolean;
}
