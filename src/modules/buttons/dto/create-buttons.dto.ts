import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateButtonDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  data?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  url?: string;
}
