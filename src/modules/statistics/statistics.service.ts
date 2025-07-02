import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [
      totalUsers,
      inGroupUsers,
      registeredUsers,
      activeUsers,
      totalSubscriptions,
      activeSubscriptions,
      expiredSubscriptions,
      revenue,
      subscriptionDistribution,
      failedTransactions,
      canceledTransactions,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { inGroup: true } }),
      this.prisma.user.count({ where: { status: 'REGISTERED' } }),
      this.prisma.user.count({ where: { lastActiveAt: { not: null } } }),
      this.prisma.subscription.count(),
      this.prisma.subscription.count({
        where: { expiredDate: { gt: new Date() } },
      }),
      this.prisma.subscription.count({
        where: { expiredDate: { lt: new Date() } },
      }),
      this.getRevenueGroupedByPaymentType(),
      this.getSubscriptionTypeDistribution(),
      this.prisma.transaction.count({ where: { status: 'Failed' } }),
      this.prisma.transaction.count({ where: { status: 'Canceled' } }),
    ]);

    return {
      users: {
        total: totalUsers,
        inGroup: inGroupUsers,
        registered: registeredUsers,
        active: activeUsers,
      },
      subscriptions: {
        total: totalSubscriptions,
        active: activeSubscriptions,
        expired: expiredSubscriptions,
      },
      revenue,
      subscriptionDistribution,
      transactions: {
        failed: failedTransactions,
        canceled: canceledTransactions,
      },
    };
  }

  private async getRevenueGroupedByPaymentType() {
    const result = await this.prisma.transaction.groupBy({
      by: ['paymentType'],
      where: { status: 'Paid' },
      _sum: { price: true },
    });

    return result.reduce(
      (acc, item) => {
        acc[item.paymentType] = item._sum.price || 0;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  private async getSubscriptionTypeDistribution() {
    const result = await this.prisma.subscription.groupBy({
      by: ['subscriptionTypeId'],
      _count: true,
    });

    const types = await this.prisma.subscriptionType.findMany({
      select: { id: true, title: true },
    });

    const typeMap = Object.fromEntries(types.map((t) => [t.id, t.title]));

    return result.map((r) => ({
      type: typeMap[r.subscriptionTypeId] ?? `Type ${r.subscriptionTypeId}`,
      count: r._count,
    }));
  }
  async getUserCountBySubscriptionType() {
    const subscriptionTypes = await this.prisma.subscriptionType.findMany({});
    const data = [];

    for (const subscriptionType of subscriptionTypes) {
      const activeCount = await this.prisma.user.count({
        where: {
          subscription: {
            some: {
              subscriptionTypeId: subscriptionType.id,
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
