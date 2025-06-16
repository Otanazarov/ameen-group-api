import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllSubscriptionDto } from './dto/findAll-subscription.dto';
import { Subscription, SubscriptionStatus } from '@prisma/client';

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
    const subscription = await this.prisma.subscription.create({
      data: {
        userId: createSubscriptionDto.userId,
        startDate: createSubscriptionDto.startDate,
        expiredDate: createSubscriptionDto.expiredDate,
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
    return subscription;
  }

  async findAll(dto: FindAllSubscriptionDto) {
    return await this.prisma.subscription.findMany({
      where: {
        userId: dto.userId,
        subscriptionTypeId: dto.subscriptionTypeId,
        startDate: dto.startDate,
        expiredDate: dto.expireDate,
        paymentType: dto.paymentType,
      },
      include: {
        user: true,
        subscriptionType: true,
      },
    });
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

  async subscriptionPaid(subscription: Subscription) {
    //TODO subscription
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
