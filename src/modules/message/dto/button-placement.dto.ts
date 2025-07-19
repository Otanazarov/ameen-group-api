import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class ButtonPlacementDto {
  @ApiProperty()
  @IsInt()
  buttonId: number;

  @ApiProperty()
  @IsInt()
  row: number;

  @ApiProperty()
  @IsInt()
  column: number;
}
