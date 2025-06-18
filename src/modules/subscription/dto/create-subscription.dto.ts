import {
  IsInt,
  IsDateString,
  IsEnum,
  IsString,
  IsNumber,
  IsPositive,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentType, SubscriptionStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsId } from 'src/common/dtos/id.dto';

export class CreateSubscriptionDto {
  @IsId()
  userId: number;


  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty({ enum: PaymentType })
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;

  @IsId()
  subscriptionTypeId: number;
}
function ApiOperationOptional(): (
  target: CreateSubscriptionDto,
  propertyKey: 'subscriptionTypeId',
) => void {
  throw new Error('Function not implemented.');
}
