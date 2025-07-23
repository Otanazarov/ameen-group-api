import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentType, TransactionType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  minPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxPrice: number;

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  oneTime?: boolean;
}
