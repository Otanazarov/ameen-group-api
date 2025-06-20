import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSettingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  aboutAminGroup: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  aboutKozimxonTorayev: string;
}
