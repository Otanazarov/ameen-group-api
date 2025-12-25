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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const findAll_subscription_dto_1 = require("./dto/findAll-subscription.dto");
const via_service_1 = require("../via/via.service");
let SubscriptionService = class SubscriptionService {
    constructor(prisma, viaService) {
        this.prisma = prisma;
        this.viaService = viaService;
    }
    async activateFreeTrial(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('User not found');
        }
        if (user.trialUsed) {
            throw new Error('Free trial already used');
        }
        if (!user.cards || user.cards.length === 0) {
            throw new Error('User has no saved cards. Please add a card first.');
        }
        const existingSubscription = await this.prisma.subscription.findFirst({
            where: { expiredDate: { gt: new Date() }, user: { id: user.id } },
        });
        if (existingSubscription) {
            throw new Error('You already have an active subscription');
        }
        const startDate = new Date();
        const expiredDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        const subscription = await this.prisma.subscription.create({
            data: {
                userId: userId,
                startDate,
                expiredDate,
                alertCount: 0,
            },
            include: {
                user: true,
                subscriptionType: true,
            },
        });
        await this.prisma.user.update({
            where: { id: userId },
            data: { trialUsed: true, status: 'TRIAL' },
        });
        return subscription;
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
    async createViaSubscription(userId, subscriptionTypeId, cardToken) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.HttpException('User not found', 404);
        }
        const subscriptionType = await this.prisma.subscriptionType.findUnique({
            where: { id: subscriptionTypeId },
        });
        if (!subscriptionType) {
            throw new common_1.HttpException('Subscription type not found', 404);
        }
        if (!subscriptionType.viaTariffId) {
            throw new common_1.HttpException('Via tariff ID not configured for this subscription type', 400);
        }
        const transaction = await this.prisma.transaction.create({
            data: {
                userId: user.id,
                subscriptionTypeId,
                price: subscriptionType.price,
                paymentType: 'VIA',
                status: 'Created',
            },
        });
        try {
            const contract = await this.viaService.createContract({
                tariffId: subscriptionType.viaTariffId,
                cardToken: cardToken,
            });
            if (!contract.data || !contract.data.id) {
                throw new Error('Failed to create Via contract');
            }
            const activatedContract = await this.viaService.activateContract(contract.data.id);
            const startDate = new Date(activatedContract.data.contractDate * 1000);
            const expiredDate = new Date(activatedContract.data.nextPayDate * 1000);
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    viaContractId: activatedContract.data.id,
                    status: 'SUBSCRIBE',
                },
            });
            await this.prisma.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: 'Paid',
                    transactionId: activatedContract.data.id,
                },
            });
            const subscription = await this.prisma.subscription.create({
                data: {
                    userId: userId,
                    subscriptionTypeId: subscriptionTypeId,
                    transactionId: transaction.id,
                    startDate: startDate.toString(),
                    expiredDate: expiredDate.toString(),
                    viaContractId: activatedContract.data.id,
                    alertCount: 0,
                },
            });
            return {
                subscription,
                viaData: activatedContract.data,
            };
        }
        catch (error) {
            await this.prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: 'Failed' },
            });
            throw new common_1.HttpException(error.message || 'Via subscription creation failed', error.status || 500);
        }
    }
    async deactivateViaSubscription(contractId) {
        const user = await this.prisma.user.findFirst({
            where: { viaContractId: contractId },
        });
        if (!user) {
            throw new common_1.HttpException('User with this contract ID not found', 404);
        }
        try {
            const response = await this.viaService.deactivateContract(contractId);
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    status: 'UNSUBSCRIBE',
                },
            });
            await this.prisma.subscription.updateMany({
                where: {
                    viaContractId: contractId,
                    expiredDate: { gt: new Date() },
                },
                data: {
                    expiredDate: new Date(),
                },
            });
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Via subscription deactivation failed', error.status || 500);
        }
    }
    async deleteViaSubscription(contractId) {
        const user = await this.prisma.user.findFirst({
            where: { viaContractId: contractId },
        });
        if (!user) {
            throw new common_1.HttpException('User with this contract ID not found', 404);
        }
        try {
            const response = await this.viaService.deleteContract(contractId);
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    status: 'UNSUBSCRIBE',
                    viaContractId: null,
                },
            });
            await this.prisma.subscription.updateMany({
                where: {
                    viaContractId: contractId,
                    expiredDate: { gt: new Date() },
                },
                data: {
                    expiredDate: new Date(),
                },
            });
            return response;
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Via subscription deletion failed', error.status || 500);
        }
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => via_service_1.ViaService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        via_service_1.ViaService])
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map