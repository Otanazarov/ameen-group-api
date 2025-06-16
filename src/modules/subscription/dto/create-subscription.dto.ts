import {
  IsInt,
  IsDateString,
  IsEnum,
  IsString,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsInt()
  userId: number;

  @ApiProperty({ example: '2023-10-01T00:00:00.000Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2023-10-01T00:00:00.000Z' })
  @IsDateString()
  expiredDate: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty({ enum: PaymentType })
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsInt()
  subscriptionTypeId: number;
}
