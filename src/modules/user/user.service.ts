import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HttpError } from 'src/common/exception/http.error';
import { FindAllUserDto } from './dto/findAll-user.dto';
import { SubscriptionStatus, UserRole } from '@prisma/client';
import { isPhoneNumber } from 'class-validator';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
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
    const { limit = 10, page = 1, name, phoneNumber, telegramId } = dto;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: {
          firstName: {
            contains: name?.trim() || '',
            mode: 'insensitive',
          },
          phoneNumber: phoneNumber
            ? { contains: phoneNumber.trim(), mode: 'insensitive' }
            : undefined,
          telegramId: telegramId
            ? { contains: telegramId.trim(), mode: 'insensitive' }
            : undefined,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({
        where: {
          firstName: {
            contains: name?.trim() || '',
            mode: 'insensitive',
          },
        },
      }),
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
        status: SubscriptionStatus.Paid,
        expiredDate: {
          gt: new Date(),
        },
      },
      include: { subscriptionType: true, user: true },
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
      name: updateUserDto.firsName ?? user.firstName,
      email: updateUserDto.email ?? user.email,
      lastName: updateUserDto.lastName ?? user.lastName,
      phoneNumber: updateUserDto.phoneNumber ?? user.phoneNumber,
      status: updateUserDto.status ?? user.status,
      role: updateUserDto.role ?? user.role,
      inGroup: updateUserDto.inGroup ?? user.inGroup,
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
