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
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const subscription_service_1 = require("../subscription/subscription.service");
const subscription_type_service_1 = require("../subscription-type/subscription-type.service");
const http_error_1 = require("../../common/exception/http.error");
let TransactionService = class TransactionService {
    constructor(prisma, subscriptionService, subscriptionTypeService) {
        this.prisma = prisma;
        this.subscriptionService = subscriptionService;
        this.subscriptionTypeService = subscriptionTypeService;
    }
    async create(createTransactionDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: createTransactionDto.userId },
        });
        if (!user) {
            throw new http_error_1.HttpError({ message: 'User not found' });
        }
        const subscriptionType = await this.prisma.subscriptionType.findFirst({
            where: { id: createTransactionDto.subscriptionTypeId },
        });
        if (!subscriptionType) {
            throw new http_error_1.HttpError({ message: 'Subscription type not found' });
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
                throw new http_error_1.HttpError({
                    message: 'You already have an this subscription',
                });
            }
        }
        const transaction = await this.prisma.transaction.create({
            data: {
                type: createTransactionDto.type,
                transactionId: createTransactionDto.transactionId,
                userId: user.id,
                subscriptionTypeId: subscriptionType.id,
                price: createTransactionDto.price,
                paymentType: createTransactionDto.paymentType,
                status: createTransactionDto.status || client_1.TransactionStatus.Created,
            },
        });
        if (transaction.status === client_1.TransactionStatus.Paid) {
            await this.transactionPaid(transaction);
        }
        return transaction;
    }
    async findAll(dto) {
        const { limit = 10, page = 1, userId, paymentType, type, subscriptionTypeId, phone, username, oneTime, maxPrice, minPrice, } = dto;
        const where = {};
        if (userId) {
            where.userId = userId;
        }
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice)
                where.price.gte = minPrice;
            if (maxPrice)
                where.price.lte = maxPrice;
        }
        if (oneTime !== undefined) {
            where.subscriptionType = { oneTime };
        }
        if (phone || username) {
            where.user = {};
        }
        if (phone) {
            where.user.phoneNumber = { contains: phone };
        }
        if (username) {
            where.user.username = { contains: username };
        }
        if (subscriptionTypeId) {
            where.subscriptionTypeId = subscriptionTypeId;
        }
        if (paymentType) {
            where.paymentType = paymentType;
        }
        if (type) {
            where.type = type;
        }
        const [data, total] = await this.prisma.$transaction([
            this.prisma.transaction.findMany({
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
            this.prisma.transaction.count({
                where,
            }),
        ]);
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
        const [data, total] = await this.prisma.$transaction([
            this.prisma.transaction.findMany({
                where: { user: { id: userId } },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.transaction.count({ where: { user: { id: userId } } }),
        ]);
        return {
            total,
            page,
            limit,
            data,
        };
    }
    async findOneByTransactionId(transactionId) {
        const transaction = await this.prisma.transaction.findFirst({
            where: { transactionId: transactionId },
            include: {
                user: true,
                subscriptionType: true,
            },
        });
        if (!transaction) {
            throw new http_error_1.HttpError({ message: 'Transaction not found' });
        }
        return transaction;
    }
    async findOne(id) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
            include: {
                user: true,
                subscriptionType: true,
            },
        });
        if (!transaction) {
            throw new http_error_1.HttpError({ message: 'Transaction not found' });
        }
        return transaction;
    }
    async update(id, updateTransactionDto) {
        let transaction = await this.prisma.transaction.findUnique({
            where: { id },
        });
        if (!transaction) {
            throw new http_error_1.HttpError({ message: 'Transaction not found' });
        }
        transaction = await this.prisma.transaction.update({
            where: { id },
            data: updateTransactionDto,
            include: {
                user: true,
                subscriptionType: true,
            },
        });
        if (updateTransactionDto.status === client_1.TransactionStatus.Paid) {
            await this.transactionPaid(transaction);
        }
        return transaction;
    }
    async transactionPaid(transaction) {
        const subscriptionType = await this.subscriptionTypeService.findOne(transaction.subscriptionTypeId);
        await this.subscriptionService.create({
            subscriptionTypeId: subscriptionType.id,
            transactionId: transaction.id,
            userId: transaction.userId,
        });
        return transaction;
    }
    async remove(id) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
        });
        if (!transaction) {
            throw new http_error_1.HttpError({ message: 'Transaction not found' });
        }
        return await this.prisma.transaction.delete({
            where: { id },
            include: {
                user: true,
                subscriptionType: true,
            },
        });
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => subscription_service_1.SubscriptionService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        subscription_service_1.SubscriptionService,
        subscription_type_service_1.SubscriptionTypeService])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map