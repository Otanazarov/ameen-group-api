import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HttpError } from 'src/common/exception/http.error';
import { TelegramService } from '../telegram/telegram.service';
import { MessageStatus } from '@prisma/client';
import { FindAllMessageDto } from './dto/findAllMessage.dto';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegramService: TelegramService,
  ) {}
  async create(createMessageDto: CreateMessageDto) {
    const { userIds, status, text, subscriptionTypeId } = createMessageDto;

    const users = await this.prisma.user.findMany({
      where: {
        status: status ? { equals: status } : undefined,
        id: userIds ? { in: userIds } : undefined,
        subscription: subscriptionTypeId
          ? { some: { subscriptionType: { id: subscriptionTypeId } } }
          : undefined,
      },
      include: {
        subscription: {
          where: {
            subscriptionType: {
              id: subscriptionTypeId,
            },
          },
        },
      },
    });

    const result = [];

    for (const user of users) {
      if (!user.telegramId) continue;

      const telegramMessage = await this.telegramService.sendMessage(
        user.telegramId,
        text,
      );

      const message = await this.prisma.message.create({
        data: {
          text,
          userId: user.id,
          status: telegramMessage
            ? MessageStatus.DELIVERED
            : MessageStatus.NOTSENT,
        },
      });

      result.push(message);
    }

    return {
      count: result.length,
      messages: result,
    };
  }

  async findAll(dto: FindAllMessageDto) {
    const { page, limit, status } = dto;
    const skip = (page - 1) * limit;
    return await this.prisma.message.findMany({
      where: {
        status,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const message = await this.prisma.message.findUnique({
      where: {
        id,
      },
    });
    if (!message) {
      throw HttpError({ code: 404, message: 'Message not found' });
    }
    return message;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const message = await this.prisma.message.findUnique({
      where: {
        id,
      },
    });
    if (!message) {
      throw HttpError({ code: 404, message: 'Message not found' });
    }
    const updatedMessage = await this.prisma.message.update({
      where: {
        id,
      },
      data: {
        status: updateMessageDto.status,
      },
    });
    return updatedMessage;
  }
}
