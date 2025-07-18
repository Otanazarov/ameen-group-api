import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSettingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  aboutAminGroup: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  aboutKozimxonTorayev: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  alertMessage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  aboutAminGroupImageId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  aboutKozimxonTorayevImageId?: number;
}
