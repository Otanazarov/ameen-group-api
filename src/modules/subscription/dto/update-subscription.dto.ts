import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';
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

  @IsId(false)
  subscriptionTypeId?: number;
}
