import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HttpError } from 'src/common/exception/http.error';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUserDto } from './dto/findAll-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const currentUserCount = await this.prisma.user.count();
    const userCount = 5 - currentUserCount;

    for (let i = 0; i < userCount; i++) {
      this.create({
        firstName: `User ${i}`,
        lastName: `User ${i}`,
        email: `user${i}@gmail.com`,
        phoneNumber: `+998${i + Math.floor(Math.random() * 80)}1234567`,
        telegramId: i.toString(),
        username: 'user' + i.toString(),
      });
    }
  }

  async create(createUserDto: CreateUserDto) {
    const phoneNumber = await this.prisma.user.findFirst({
      where: { phoneNumber: createUserDto.phoneNumber },
    });
    if (phoneNumber) {
      throw HttpError({ code: 'User with this phone number already exists' });
    }
    const telegramId = await this.prisma.user.findFirst({
      where: { telegramId: createUserDto.telegramId },
    });
    if (telegramId) {
      throw HttpError({ code: 'User with this telegram ID already exists' });
    }

    const user = await this.prisma.user.create({
      data: createUserDto,
    });
    return user;
  }

  async findAll(dto: FindAllUserDto) {
    const {
      limit = 10,
      page = 1,
      name,
      phoneNumber,
      telegramId,
      status,
      subscriptionTypeId,
      subscriptionStatus,
    } = dto;

    const where: Prisma.UserWhereInput = {
      firstName: name?.trim()
        ? {
            contains: name.trim(),
            mode: 'insensitive',
          }
        : undefined,
      phoneNumber: phoneNumber?.trim()
        ? {
            contains: phoneNumber.trim(),
            mode: 'insensitive',
          }
        : undefined,
      telegramId: telegramId?.trim()
        ? {
            contains: telegramId.trim(),
            mode: 'insensitive',
          }
        : undefined,
      status: status || undefined,
      subscription: subscriptionTypeId
        ? {
            some: {
              subscriptionType: {
                id: subscriptionTypeId,
              },
              expiredDate:
                subscriptionStatus !== undefined
                  ? subscriptionStatus === 'EXPIRED'
                    ? { lt: new Date() }
                    : { gt: new Date() }
                  : undefined,
            },
          }
        : undefined,
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          subscription: true,
          messageUser: true,
          transaction: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      total,
      page,
      limit,
      data,
    };
  }

  async getSubscription(telegramId: number) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        user: { telegramId: telegramId.toString() },
        expiredDate: {
          gt: new Date(),
        },
      },
      include: { subscriptionType: true, user: true, transaction: true },
    });
    return subscription;
  }

  async findOneByTelegramID(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { telegramId: id },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      throw HttpError({ code: 'User not found' });
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw HttpError({ code: 'User not found' });
    }

    if (updateUserDto.phoneNumber) {
      const phoneExists = await this.prisma.user.findUnique({
        where: { phoneNumber: updateUserDto.phoneNumber },
      });

      if (phoneExists && phoneExists.id !== id) {
        throw HttpError({ code: 'User with this phone number already exists' });
      }
    }

    if (updateUserDto.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailExists && emailExists.id !== id) {
        throw HttpError({ code: 'User with this email already exists' });
      }
    }

    const updateData = {
      firstName: updateUserDto.firstName ?? user.firstName,
      email: updateUserDto.email ?? user.email,
      lastName: updateUserDto.lastName ?? user.lastName,
      phoneNumber: updateUserDto.phoneNumber ?? user.phoneNumber,
      status: updateUserDto.status ?? user.status,
      inGroup: updateUserDto.inGroup ?? user.inGroup,
      lastActiveAt: updateUserDto.lastActiveAt ?? user.lastActiveAt,
    };

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw HttpError({ code: 'User not found' });
    }
    const deletedUser = await this.prisma.user.delete({
      where: { id },
    });
    return {
      message: 'User deleted successfully',
      user: deletedUser,
    };
  }
}
