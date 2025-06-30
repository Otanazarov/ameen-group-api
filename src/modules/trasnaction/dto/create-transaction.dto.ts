import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  PaymentType,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsId } from 'src/common/dtos/id.dto';

export class CreateTransactionDto {
  @IsId()
  userId: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty({ enum: PaymentType })
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ApiProperty({ enum: TransactionType })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsId()
  subscriptionTypeId: number;
}
