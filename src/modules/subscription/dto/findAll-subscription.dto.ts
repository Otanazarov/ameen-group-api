import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentType } from '@prisma/client';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { IsId } from 'src/common/dtos/id.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FindAllSubscriptionDto extends PaginationDto {
  @IsId(false)
  userId: number;

  @IsId(false)
  subscriptionTypeId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  startDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  expireDate: Date;
}
