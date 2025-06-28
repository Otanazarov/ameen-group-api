import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSettingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutAminGroup?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutKozimxonTorayev?: string;
}
