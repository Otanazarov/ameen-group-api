import { ApiPropertyOptional } from '@nestjs/swagger';
import { MessageStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateMessageDto {
  @ApiPropertyOptional()
  @IsEnum(MessageStatus)
  status?: MessageStatus;
}
