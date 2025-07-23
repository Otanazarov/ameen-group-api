import { StatisticsService } from './statistics.service';
export declare class StatisticsController {
    private readonly statisticsService;
    constructor(statisticsService: StatisticsService);
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
    getUserCountBySubscriptionType(): Promise<any[]>;
}
