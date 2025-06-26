import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString } from 'class-validator';
import { MessageStatus } from '@prisma/client';

export class CreateMessageDto {
  @ApiProperty({ example: 'Salom, qanday yordam bera olaman?' })
  @IsString()
  text: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  userId: number;

  @ApiProperty({ enum: MessageStatus, default: MessageStatus.NOTSENT })
  @IsEnum(MessageStatus)
  status: MessageStatus;
}
