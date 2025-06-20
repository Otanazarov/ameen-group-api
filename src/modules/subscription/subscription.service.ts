import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllSubscriptionDto } from './dto/findAll-subscription.dto';
import { Prisma, Subscription, SubscriptionStatus } from '@prisma/client';
import { UserService } from '../user/user.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}
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
      where: { expiredDate: { gt: new Date() } },
      orderBy: { expiredDate: 'desc' },
    });

    let startDate = new Date();

    if (existingSubscription) {
      if (existingSubscription.expiredDate) {
        const currentDate = new Date();
        const timeDifference =
          existingSubscription.expiredDate.getTime() - currentDate.getTime();
        const daysDifference = timeDifference / (1000 * 60 * 60 * 30);

        if (daysDifference < 3) {
          throw new Error();
        }
      }

      startDate = existingSubscription.expiredDate;
    }

    let expiredDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const subscription = await this.prisma.subscription.create({
      data: {
        userId: createSubscriptionDto.userId,
        startDate,
        expiredDate,
        price: createSubscriptionDto.price,
        paymentType: createSubscriptionDto.paymentType,
        subscriptionTypeId: createSubscriptionDto.subscriptionTypeId,
        alertCount: 0,
        status: createSubscriptionDto.status || SubscriptionStatus.Created,
      },
      include: {
        user: true,
        subscriptionType: true,
      },
    });

    if (subscription.status === SubscriptionStatus.Paid) {
      await this.subscriptionPaid(subscription);
    }

    return subscription;
  }

  async findAll(dto: FindAllSubscriptionDto) {
    const {
      limit = 10,
      page = 1,
      userId,
      subscriptionTypeId,
      paymentType,
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

    if (paymentType) {
      where.paymentType = paymentType;
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

    const [data, total] = await this.prisma.$transaction([
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

    if (updateSubscriptionDto.status === SubscriptionStatus.Paid) {
      await this.subscriptionPaid(subscription);
    }

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
