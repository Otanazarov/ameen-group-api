import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PrismaService } from '../prisma/prisma.service';

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
      },
      include: {
        user: true,
        subscriptionType: true,
      },
    });
    return subscription;
  }

  findAll() {
    return `This action returns all subscription`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
