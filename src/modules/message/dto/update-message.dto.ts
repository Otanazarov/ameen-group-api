import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';
import { IsEnum } from 'class-validator';
import { MessageStatus } from '@prisma/client';

export class UpdateMessageDto {
  @ApiPropertyOptional()
  @IsEnum(MessageStatus)
  status?: MessageStatus;
}
