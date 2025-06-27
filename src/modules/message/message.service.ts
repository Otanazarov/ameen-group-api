import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HttpError } from 'src/common/exception/http.error';
import { TelegramService } from '../telegram/telegram.service';
import { MessageStatus } from '@prisma/client';
import { FindAllMessageDto } from './dto/findAllMessage.dto';
import { FindAllMessageUserDto } from './dto/findAllMessageUser.dto';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => TelegramService))
    private readonly telegramService: TelegramService,
  ) {}
  async create(createMessageDto: CreateMessageDto) {
    const { userIds, status, text, subscriptionTypeId, sendTime } =
      createMessageDto;

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

    const message = await this.prisma.message.create({
      data: {
        text,
        time: sendTime || new Date(),
      },
    });

    for (const user of users) {
      if (!user.telegramId) continue;

      await this.prisma.messageUser.create({
        data: {
          userId: user.id,
          status: MessageStatus.PENDING,
          messageId: message.id,
        },
        include: { user: true, message: true },
      });
    }

    return message;
  }

  async findAll(dto: FindAllMessageDto) {
    const { page, limit, text } = dto;
    const skip = (page - 1) * limit;
    return await this.prisma.message.findMany({
      where: {
        text,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAllUser(dto: FindAllMessageUserDto) {
    const { page, limit, status } = dto;
    const skip = (page - 1) * limit;
    return await this.prisma.messageUser.findMany({
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

  async findOneUser(id: number) {
    const message = await this.prisma.messageUser.findUnique({
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
    const updatedMessage = await this.prisma.messageUser.update({
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
