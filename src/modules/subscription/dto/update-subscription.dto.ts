import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { IsId } from 'src/common/dtos/id.dto';

export class UpdateSubscriptionDto {
  @IsId(false)
  userId: number;

  @ApiPropertyOptional({ example: '2023-10-01T00:00:00.000Z' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: '2023-10-01T00:00:00.000Z' })
  @IsDateString()
  expiredDate: string;

  @ApiPropertyOptional()
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ enum: PaymentType })
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @IsId(false)
  subscriptionTypeId: number;
}
