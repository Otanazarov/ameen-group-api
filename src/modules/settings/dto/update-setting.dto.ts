import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateSettingDto } from './create-setting.dto';
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
