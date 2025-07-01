import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HttpError } from 'src/common/exception/http.error';
import { MessageStatus } from '@prisma/client';
import { FindAllMessageDto } from './dto/findAllMessage.dto';
import { FindAllMessageUserDto } from './dto/findAllMessageUser.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}
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

    const message = await this.prisma.message.create({
      data: {
        text,
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
    const { page = 1, limit = 10, text } = dto;
    const skip = (page - 1) * limit;
    return (
      await this.prisma.message.findMany({
        where: {
          text,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          _count: { select: { users: true } },
        },
      })
    ).map((message) => ({
      ...message,
      users: message._count.users,
      _count: undefined,
    }));
  }

  async findAllUser(dto: FindAllMessageUserDto) {
    const { page = 1, limit = 10, status } = dto;
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
      include: { users: true },
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
