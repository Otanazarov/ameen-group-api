import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  FindAllSubscriptionDto,
  SubscriptionStatus,
} from './dto/findAll-subscription.dto';
import { Prisma } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: createSubscriptionDto.userId },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const subscriptionType = await this.prisma.subscriptionType.findUnique({
      where: { id: createSubscriptionDto.subscriptionTypeId },
    });
    if (!subscriptionType) {
      throw new Error('Subscription type not found');
    }

    const existingSubscription = await this.prisma.subscription.findFirst({
      where: { expiredDate: { gt: new Date() }, user: { id: user.id } },
      orderBy: { expiredDate: 'desc' },
      include: { subscriptionType: true },
    });

    let startDate = new Date();

    if (existingSubscription) {
      if (existingSubscription.expiredDate) {
        const currentDate = new Date();
        const timeDifference =
          existingSubscription.expiredDate.getTime() - currentDate.getTime();
        const daysDifference =
          timeDifference /
          (1000 * 60 * 60 * existingSubscription.subscriptionType.expireDays);

        if (daysDifference < 3) {
          throw new Error('you already have an active subscription');
        }
      }

      startDate = existingSubscription.expiredDate;
    }

    const expiredDate = new Date(
      startDate.getTime() + subscriptionType.expireDays * 24 * 60 * 60 * 1000,
    );
    const subscription = await this.prisma.subscription.create({
      data: {
        userId: createSubscriptionDto.userId,
        startDate,
        expiredDate,
        subscriptionTypeId: createSubscriptionDto.subscriptionTypeId,
        alertCount: 0,
        transactionId: createSubscriptionDto.transactionId,
      },
      include: {
        user: true,
        subscriptionType: true,
      },
    });

    await this.subscriptionPaid(subscription);

    return subscription;
  }

  async findAll(dto: FindAllSubscriptionDto) {
    const {
      limit = 10,
      page = 1,
      userId,
      status,
      subscriptionTypeId,
      startDateFrom,
      startDateTo,
      expireDateFrom,
      expireDateTo,
    } = dto;

    const where: Prisma.SubscriptionWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    if (subscriptionTypeId) {
      where.subscriptionTypeId = subscriptionTypeId;
    }

    if (startDateFrom || startDateTo) {
      where.startDate = {};
      if (startDateFrom) where.startDate.gte = startDateFrom;
      if (startDateTo) where.startDate.lte = startDateTo;
    }

    if (expireDateFrom || expireDateTo) {
      where.expiredDate = {};
      if (expireDateFrom) where.expiredDate.gte = expireDateFrom;
      if (expireDateTo) where.expiredDate.lte = expireDateTo;
    }

    if (status) {
      if (status == SubscriptionStatus.ACTIVE)
        where.expiredDate = { lt: new Date() };
      if (status == SubscriptionStatus.EXPIRED)
        where.expiredDate = { gt: new Date() };
    }

    // eslint-disable-next-line prefer-const
    let [data, total] = await this.prisma.$transaction([
      this.prisma.subscription.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: true,
          subscriptionType: true,
        },
      }),
      this.prisma.subscription.count({
        where,
      }),
    ]);

    data = data.map((subscription) => {
      return {
        ...subscription,
        status: subscription.expiredDate < new Date() ? 'EXPIRED' : 'ACTIVE',
      };
    });

    return {
      total,
      page,
      limit,
      data,
    };
  }

  async findOneByUserId(userId: number, dto: PaginationDto) {
    const { limit = 10, page = 1 } = dto;

    const skip = (page - 1) * limit;

    // eslint-disable-next-line prefer-const
    let [data, total] = await this.prisma.$transaction([
      this.prisma.subscription.findMany({
        where: { user: { id: userId } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { subscriptionType: true },
      }),
      this.prisma.subscription.count({ where: { user: { id: userId } } }),
    ]);

    data = data.map((subscription) => ({
      ...subscription,
      status: subscription.expiredDate < new Date() ? 'EXPIRED' : 'ACTIVE',
      days: Math.floor(
        (subscription.expiredDate.getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    }));

    return {
      total,
      page,
      limit,
      data,
    };
  }

  async findOne(id: number) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
      include: {
        user: true,
        subscriptionType: true,
      },
    });
    if (!subscription) {
      throw new Error('Subscription not found');
    }
    return subscription;
  }

  async update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    let subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    subscription = await this.prisma.subscription.update({
      where: { id },
      data: updateSubscriptionDto,
      include: {
        user: true,
        subscriptionType: true,
      },
    });

    return subscription;
  }

  async subscriptionPaid(subscription: any) {
    await this.prisma.user.update({
      where: { id: subscription.user.id },
      data: { status: 'SUBSCRIBE' },
    });

    return subscription;
  }

  async remove(id: number) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });
    if (!subscription) {
      throw new Error('Subscription not found');
    }
    return await this.prisma.subscription.delete({
      where: { id },
      include: {
        user: true,
        subscriptionType: true,
      },
    });
  }
}
