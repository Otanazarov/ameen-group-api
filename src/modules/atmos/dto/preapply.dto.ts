import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsId } from 'src/common/dtos/id.dto';

export class PreApplyAtmosDto {
  @IsId()
  transaction_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  card_number: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  expiry: string;
}
