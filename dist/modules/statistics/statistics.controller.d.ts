import { StatisticsService } from './statistics.service';
export declare class StatisticsController {
    private readonly statisticsService;
    constructor(statisticsService: StatisticsService);
    getUserCountBySubscriptionType(): Promise<{
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
    }>;
    statistics(): Promise<any[]>;
}
