import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  format,
} from 'date-fns';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const firstDayOfMonth = startOfMonth(now);
    const lastDayOfMonth = endOfMonth(now);

    const [
      usersCount,
      activeSubscriptionsCount,
      totalRevenueThisMonth,
      pendingPaymentsThisMonth,
      monthlyRevenue,
      monthlyActiveSubscriptions,
      monthlyExpectedRevenue,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.subscription.count({
        where: { expiredDate: { gt: now } },
      }),
      this.prisma.transaction.aggregate({
        _sum: { price: true },
        where: {
          status: 'Paid',
          createdAt: {
            gte: firstDayOfMonth,
            lte: lastDayOfMonth,
          },
        },
      }),
      this.prisma.transaction.aggregate({
        _sum: { price: true },
        where: {
          status: 'Created',
          createdAt: {
            gte: firstDayOfMonth,
            lte: lastDayOfMonth,
          },
        },
      }),
      this.getMonthlyRevenue(),
      this.getMonthlyActiveSubscriptions(),
      this.getMonthlyExpectedRevenue(),
    ]);

    return {
      usersCount,
      activeSubscriptionsCount,
      totalRevenueThisMonth: totalRevenueThisMonth._sum.price || 0,
      pendingPaymentsThisMonth: pendingPaymentsThisMonth._sum.price || 0,
      monthlyRevenue,
      monthlyActiveSubscriptions,
      monthlyExpectedRevenue,
    };
  }

  private async getMonthlyExpectedRevenue() {
    const now = new Date();
    const last12MonthsStart = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      1,
    );
    const last12MonthsEnd = new Date();

    const months = eachMonthOfInterval({
      start: last12MonthsStart,
      end: last12MonthsEnd,
    });
    const monthlyData = months.map((month) => ({
      month: format(month, 'MMMM'),
      revenue: 0,
    }));

    const activeSubscriptions = await this.prisma.subscription.findMany({
      where: {
        expiredDate: { gt: now },
      },
      include: {
        subscriptionType: true,
      },
    });

    activeSubscriptions.forEach((subscription) => {
      const monthName = format(new Date(subscription.createdAt), 'MMMM');
      const monthData = monthlyData.find((m) => m.month === monthName);
      if (monthData) {
        monthData.revenue += subscription.subscriptionType.price || 0;
      }
    });

    return monthlyData;
  }

  private async getMonthlyRevenue() {
    const now = new Date();
    const last12MonthsStart = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      1,
    );
    const last12MonthsEnd = new Date();

    const monthlyRevenue = await this.prisma.transaction.groupBy({
      by: ['createdAt'],
      where: {
        status: 'Paid',
        createdAt: {
          gte: last12MonthsStart,
          lte: last12MonthsEnd,
        },
      },
      _sum: { price: true },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const months = eachMonthOfInterval({
      start: last12MonthsStart,
      end: last12MonthsEnd,
    });
    const monthlyData = months.map((month) => ({
      month: format(month, 'MMMM'),
      revenue: 0,
    }));

    monthlyRevenue.forEach((item) => {
      const monthName = format(new Date(item.createdAt), 'MMMM');
      const monthData = monthlyData.find((m) => m.month === monthName);
      if (monthData) {
        monthData.revenue += item._sum.price || 0;
      }
    });

    return monthlyData;
  }

  private async getMonthlyActiveSubscriptions() {
    const now = new Date();
    const last12MonthsStart = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      1,
    );
    const last12MonthsEnd = new Date();
    const months = eachMonthOfInterval({
      start: last12MonthsStart,
      end: last12MonthsEnd,
    });

    const monthlyActiveSubscriptions = await Promise.all(
      months.map(async (month) => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        const count = await this.prisma.subscription.count({
          where: {
            startDate: { lte: monthEnd },
            expiredDate: { gte: monthStart },
          },
        });
        return {
          month: format(month, 'MMMM'),
          activeSubscriptions: count,
        };
      }),
    );

    return monthlyActiveSubscriptions;
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
