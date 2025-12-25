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
exports.SubscriptionTypeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SubscriptionTypeService = class SubscriptionTypeService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createSubscriptionTypeDto) {
        const subscriptionType = await this.prisma.subscriptionType.create({
            data: {
                price: createSubscriptionTypeDto.price,
                title: createSubscriptionTypeDto.title,
                description: createSubscriptionTypeDto.description,
                expireDays: createSubscriptionTypeDto.expireDays,
                oneTime: createSubscriptionTypeDto.oneTime,
                viaTariffId: createSubscriptionTypeDto.viaTariffId,
            },
        });
        return {
            ...subscriptionType,
            price: subscriptionType.price.toString(),
        };
    }
    async findAll(dto) {
        const { limit = 10, page = 1, title, isDeleted = false, oneTime } = dto;
        const [data, total] = await this.prisma.$transaction([
            this.prisma.subscriptionType.findMany({
                where: {
                    isDeleted,
                    oneTime,
                    title: {
                        contains: title?.trim() || '',
                        mode: 'insensitive',
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.subscriptionType.count({
                where: {
                    isDeleted,
                    oneTime,
                    title: {
                        contains: title?.trim() || '',
                        mode: 'insensitive',
                    },
                },
            }),
        ]);
        return {
            total,
            page,
            limit,
            data: data.map((subscriptionType) => ({
                ...subscriptionType,
                price: subscriptionType.price.toString(),
            })),
        };
    }
    async findOne(id) {
        const subscriptionType = await this.prisma.subscriptionType.findUnique({
            where: { id },
        });
        if (!subscriptionType) {
            throw new Error(`Subscription type with id ${id} not found`);
        }
        return {
            ...subscriptionType,
            price: subscriptionType.price.toString(),
        };
    }
    async update(id, dto) {
        const existing = await this.prisma.subscriptionType.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new Error(`Subscription type with id ${id} not found`);
        }
        const updateData = {
            price: dto.price ?? existing.price,
            title: dto.title ?? existing.title,
            description: dto.description ?? existing.description,
            expireDays: dto.expireDays ?? existing.expireDays,
            viaTariffId: dto.viaTariffId ?? existing.viaTariffId,
        };
        const updatedSubscriptionType = await this.prisma.subscriptionType.update({
            where: { id },
            data: updateData,
        });
        return {
            ...updatedSubscriptionType,
            price: updatedSubscriptionType.price.toString(),
        };
    }
    async remove(id) {
        const existing = await this.prisma.subscriptionType.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new Error(`Subscription type with id ${id} not found`);
        }
        if (existing.isDeleted) {
            throw new Error(`Subscription type with id ${id} is already deleted`);
        }
        await this.prisma.subscriptionType.update({
            where: { id },
            data: { isDeleted: true },
        });
        return { message: `Subscription type with id ${id} marked as deleted` };
    }
};
exports.SubscriptionTypeService = SubscriptionTypeService;
exports.SubscriptionTypeService = SubscriptionTypeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionTypeService);
//# sourceMappingURL=subscription-type.service.js.map