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

  @ApiPropertyOptional({
    example:
      '⚠️ Ogohlantirish! Sizning obunangiz {{expireDate}} da tugaydi. ⏳ {{daysLeft}} kun qoldi.',
  })
  @IsOptional()
  @IsString()
  alertMessage?: string;
}
