import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}
  async getUserCountBySubscriptionType() {
    const subscriptionTypes = await this.prisma.subscriptionType.findMany({});
    const data = [];

    for (const subscriptionType of subscriptionTypes) {
      const count = await this.prisma.user.count({
        where: {
          subscription: { some: { subscriptionTypeId: subscriptionType.id } },
        },
      });

      data.push({ count, subscriptionType });
    }

    return data;
  }
}
