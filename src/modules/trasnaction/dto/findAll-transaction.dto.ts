import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentType, TransactionType } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { IsId } from 'src/common/dtos/id.dto';
import { IsName } from 'src/common/dtos/name.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FindAllTransactionDto extends PaginationDto {
  @IsId(false)
  @IsOptional()
  userId?: number;

  @IsName(false)
  username: string;

  @IsName(false)
  phone: string;

  @IsId(false)
  @IsOptional()
  subscriptionTypeId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PaymentType)
  paymentType?: PaymentType;
}
