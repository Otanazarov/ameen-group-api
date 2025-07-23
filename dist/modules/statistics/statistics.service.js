"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const date_fns_1 = require("date-fns");
let StatisticsService = class StatisticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const now = new Date();
        const firstDayOfMonth = (0, date_fns_1.startOfMonth)(now);
        const lastDayOfMonth = (0, date_fns_1.endOfMonth)(now);
        const [usersCount, activeSubscriptionsCount, totalRevenueThisMonth, pendingPaymentsThisMonth, monthlyRevenue, monthlyActiveSubscriptions, monthlyExpectedRevenue,] = await Promise.all([
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
    async getMonthlyExpectedRevenue() {
        const now = new Date();
        const last12MonthsStart = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        const last12MonthsEnd = new Date();
        const months = (0, date_fns_1.eachMonthOfInterval)({
            start: last12MonthsStart,
            end: last12MonthsEnd,
        });
        const monthlyData = months.map((month) => ({
            month: (0, date_fns_1.format)(month, 'MMMM'),
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
            const monthName = (0, date_fns_1.format)(new Date(subscription.createdAt), 'MMMM');
            const monthData = monthlyData.find((m) => m.month === monthName);
            if (monthData) {
                monthData.revenue += subscription.subscriptionType.price || 0;
            }
        });
        return monthlyData;
    }
    async getMonthlyRevenue() {
        const now = new Date();
        const last12MonthsStart = new Date(now.getFullYear() - 1, now.getMonth(), 1);
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
        const months = (0, date_fns_1.eachMonthOfInterval)({
            start: last12MonthsStart,
            end: last12MonthsEnd,
        });
        const monthlyData = months.map((month) => ({
            month: (0, date_fns_1.format)(month, 'MMMM'),
            revenue: 0,
        }));
        monthlyRevenue.forEach((item) => {
            const monthName = (0, date_fns_1.format)(new Date(item.createdAt), 'MMMM');
            const monthData = monthlyData.find((m) => m.month === monthName);
            if (monthData) {
                monthData.revenue += item._sum.price || 0;
            }
        });
        return monthlyData;
    }
    async getMonthlyActiveSubscriptions() {
        const now = new Date();
        const last12MonthsStart = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        const last12MonthsEnd = new Date();
        const months = (0, date_fns_1.eachMonthOfInterval)({
            start: last12MonthsStart,
            end: last12MonthsEnd,
        });
        const monthlyActiveSubscriptions = await Promise.all(months.map(async (month) => {
            const monthStart = (0, date_fns_1.startOfMonth)(month);
            const monthEnd = (0, date_fns_1.endOfMonth)(month);
            const count = await this.prisma.subscription.count({
                where: {
                    startDate: { lte: monthEnd },
                    expiredDate: { gte: monthStart },
                },
            });
            return {
                month: (0, date_fns_1.format)(month, 'MMMM'),
                activeSubscriptions: count,
            };
        }));
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
};
exports.StatisticsService = StatisticsService;
exports.StatisticsService = StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StatisticsService);
//# sourceMappingURL=statistics.service.js.map