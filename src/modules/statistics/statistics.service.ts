import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}
  async getUserCountBySubscriptionType() {
    const subscriptionTypes = await this.prisma.subscriptionType.findMany({});
    const data = [];

    for (const subscriptionType of subscriptionTypes) {
      const activeCount = await this.prisma.user.count({
        where: {
          subscription: {
            some: {
              subscriptionTypeId: subscriptionType.id,
              status: 'Paid',
              expiredDate: { gte: new Date() },
            },
          },
        },
      });

      const expiredCount = await this.prisma.user.count({
        where: {
          subscription: {
            some: {
              subscriptionTypeId: subscriptionType.id,
              status: 'Paid',
              expiredDate: { lte: new Date() },
            },
          },
        },
      });

      data.push({
        activeCount,
        expiredCount,
        total: activeCount + expiredCount,
        subscriptionType,
      });
    }

    return data;
  }
}
