import { PrismaService } from '../prisma/prisma.service';
export declare class StatisticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        usersCount: number;
        activeSubscriptionsCount: number;
        totalRevenueThisMonth: number;
        pendingPaymentsThisMonth: number;
        monthlyRevenue: {
            month: string;
            revenue: number;
        }[];
        monthlyActiveSubscriptions: {
            month: string;
            activeSubscriptions: number;
        }[];
        monthlyExpectedRevenue: {
            month: string;
            revenue: number;
        }[];
    }>;
    private getMonthlyExpectedRevenue;
    private getMonthlyRevenue;
    private getMonthlyActiveSubscriptions;
    getUserCountBySubscriptionType(): Promise<any[]>;
}
