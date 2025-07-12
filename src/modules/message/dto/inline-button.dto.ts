import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class InlineButtonDto {
  @ApiProperty({ description: 'Text displayed on the button' })
  @IsString()
  text: string;

  @ApiPropertyOptional({ description: 'URL to open when button is clicked' })
  @IsOptional()
  @IsString()
  url?: string;
}
