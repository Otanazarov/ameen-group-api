import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HttpError } from 'src/common/exception/http.error';
import { TelegramService } from '../telegram/telegram.service';
import { MessageStatus } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegramService: TelegramService, 
  ) {}
  async create(createMessageDto: CreateMessageDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: createMessageDto.userId,
      },
    });
    if (!user) {
      throw HttpError({ code: 404, message: 'User not found' });
    }
    const telegramMessage = await this.telegramService.sendMessage(
      user.telegramId,
      createMessageDto.text,
    );
    const message = await this.prisma.message.create({
      data: {
        text: createMessageDto.text,
        userId: createMessageDto.userId,
        status: telegramMessage
          ? MessageStatus.DELIVERED
          : MessageStatus.NOTSENT,
      },
    });
    return message;
  }
  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
