import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmSchedulerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  scheduler_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  otp: string;
}
