import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { InlineButtonDto } from './inline-button.dto';

export class InlineKeyboardRowDto {
  @ApiProperty({ type: [InlineButtonDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InlineButtonDto)
  buttons: InlineButtonDto[];
}

export class InlineKeyboardDto {
  @ApiProperty({ type: [InlineKeyboardRowDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InlineKeyboardRowDto)
  inline_keyboard: InlineKeyboardRowDto[];
}
