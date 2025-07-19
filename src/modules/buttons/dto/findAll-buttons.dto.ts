import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FindAllButtonDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text: string;
}
