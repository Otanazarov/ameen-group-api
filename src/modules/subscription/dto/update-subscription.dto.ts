import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentType, SubscriptionStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { IsId } from 'src/common/dtos/id.dto';

export class UpdateSubscriptionDto {
  @IsId(false)
  userId?: number;

  @ApiPropertyOptional({ example: '2023-10-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2023-10-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  expiredDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ enum: PaymentType })
  @IsOptional()
  @IsEnum(PaymentType)
  paymentType?: PaymentType;

  @IsId(false)
  subscriptionTypeId?: number;
}
