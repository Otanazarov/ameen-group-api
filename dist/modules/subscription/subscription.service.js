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
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const findAll_subscription_dto_1 = require("./dto/findAll-subscription.dto");
let SubscriptionService = class SubscriptionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createSubscriptionDto) {
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
        if (subscriptionType.oneTime) {
            const existingSubscription = await this.prisma.subscription.findFirst({
                where: {
                    user: { id: user.id },
                    subscriptionType: { id: subscriptionType.id },
                },
                orderBy: { expiredDate: 'desc' },
                include: { subscriptionType: true },
            });
            if (existingSubscription) {
                throw new Error('You already have an this subscription');
            }
        }
        const existingSubscription = await this.prisma.subscription.findFirst({
            where: { expiredDate: { gt: new Date() }, user: { id: user.id } },
            orderBy: { expiredDate: 'desc' },
            include: { subscriptionType: true },
        });
        let startDate = new Date();
        if (existingSubscription) {
            if (existingSubscription.expiredDate) {
                const currentDate = new Date();
                const timeDifference = existingSubscription.expiredDate.getTime() - currentDate.getTime();
                const daysDifference = timeDifference /
                    (1000 * 60 * 60 * existingSubscription.subscriptionType.expireDays);
                if (daysDifference < 3) {
                    throw new Error('you already have an active subscription');
                }
            }
            startDate = existingSubscription.expiredDate;
        }
        const expiredDate = new Date(startDate.getTime() + subscriptionType.expireDays * 24 * 60 * 60 * 1000);
        const subscription = await this.prisma.subscription.create({
            data: {
                userId: createSubscriptionDto.userId,
                startDate,
                expiredDate,
                subscriptionTypeId: createSubscriptionDto.subscriptionTypeId,
                alertCount: 0,
                transactionId: createSubscriptionDto.transactionId,
            },
            include: {
                user: true,
                subscriptionType: true,
            },
        });
        await this.subscriptionPaid(subscription);
        return subscription;
    }
    async findAll(dto) {
        const { limit = 10, page = 1, userId, status, subscriptionTypeId, startDateFrom, startDateTo, expireDateFrom, expireDateTo, oneTime, maxPrice, minPrice, } = dto;
        const where = {};
        if (userId) {
            where.userId = userId;
        }
        if (minPrice) {
            where.transaction.price = { gte: minPrice };
        }
        if (maxPrice) {
            where.transaction.price = { lte: maxPrice };
        }
        if (oneTime !== undefined) {
            where.subscriptionType = { oneTime: oneTime };
        }
        if (subscriptionTypeId) {
            where.subscriptionTypeId = subscriptionTypeId;
        }
        if (startDateFrom || startDateTo) {
            where.startDate = {};
            if (startDateFrom)
                where.startDate.gte = startDateFrom;
            if (startDateTo)
                where.startDate.lte = startDateTo;
        }
        if (expireDateFrom || expireDateTo) {
            where.expiredDate = {};
            if (expireDateFrom)
                where.expiredDate.gte = expireDateFrom;
            if (expireDateTo)
                where.expiredDate.lte = expireDateTo;
        }
        if (status) {
            if (status == findAll_subscription_dto_1.SubscriptionStatus.ACTIVE)
                where.expiredDate = { lt: new Date() };
            if (status == findAll_subscription_dto_1.SubscriptionStatus.EXPIRED)
                where.expiredDate = { gt: new Date() };
        }
        let [data, total] = await this.prisma.$transaction([
            this.prisma.subscription.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    user: true,
                    subscriptionType: true,
                },
            }),
            this.prisma.subscription.count({
                where,
            }),
        ]);
        data = data.map((subscription) => {
            return {
                ...subscription,
                status: subscription.expiredDate < new Date() ? 'EXPIRED' : 'ACTIVE',
            };
        });
        return {
            total,
            page,
            limit,
            data,
        };
    }
    async findOneByUserId(userId, dto) {
        const { limit = 10, page = 1 } = dto;
        const skip = (page - 1) * limit;
        let [data, total] = await this.prisma.$transaction([
            this.prisma.subscription.findMany({
                where: { user: { id: userId } },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { subscriptionType: true },
            }),
            this.prisma.subscription.count({ where: { user: { id: userId } } }),
        ]);
        data = data.map((subscription) => ({
            ...subscription,
            status: subscription.expiredDate < new Date() ? 'EXPIRED' : 'ACTIVE',
            days: Math.floor((subscription.expiredDate.getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)),
        }));
        return {
            total,
            page,
            limit,
            data,
        };
    }
    async findOne(id) {
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
    async update(id, updateSubscriptionDto) {
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
        return subscription;
    }
    async subscriptionPaid(subscription) {
        await this.prisma.user.update({
            where: { id: subscription.user.id },
            data: { status: 'SUBSCRIBE' },
        });
        return subscription;
    }
    async remove(id) {
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
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map