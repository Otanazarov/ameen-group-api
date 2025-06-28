import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { MessageStatus } from '@prisma/client';

export class UpdateMessageDto {
  @ApiPropertyOptional()
  @IsEnum(MessageStatus)
  status?: MessageStatus;
}
