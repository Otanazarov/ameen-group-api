import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsId()
  subscriptionTypeId: number;
}
