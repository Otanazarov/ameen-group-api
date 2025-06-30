import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsId } from 'src/common/dtos/id.dto';

export class ApplyAtmosDto {
  @IsId()
  transaction_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  otp: string;
}
