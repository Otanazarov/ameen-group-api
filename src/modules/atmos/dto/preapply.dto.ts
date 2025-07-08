import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsId } from 'src/common/dtos/id.dto';

export class PreApplyAtmosDto {
  @IsId()
  transaction_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  card_number: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  expiry: string;
}
