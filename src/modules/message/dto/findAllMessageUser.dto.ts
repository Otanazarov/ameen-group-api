import { ApiPropertyOptional } from '@nestjs/swagger';
import { MessageStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FindAllMessageUserDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(MessageStatus)
  status: MessageStatus;
}
