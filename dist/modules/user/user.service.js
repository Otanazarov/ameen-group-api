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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const http_error_1 = require("../../common/exception/http.error");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() { }
    async create(createUserDto) {
        const phoneNumber = await this.prisma.user.findUnique({
            where: { phoneNumber: createUserDto.phoneNumber },
        });
        if (phoneNumber) {
            throw (0, http_error_1.HttpError)({ code: "User with this phone number already exists" });
        }
        const telegramId = await this.prisma.user.findFirst({
            where: { telegramId: createUserDto.telegramId },
        });
        if (telegramId) {
            throw (0, http_error_1.HttpError)({ code: "User with this telegram ID already exists" });
        }
        const user = await this.prisma.user.create({
            data: createUserDto,
        });
        return user;
    }
    async findAll(dto) {
        const { limit = 10, page = 1, name, phoneNumber, telegramId, status, subscriptionTypeId, subscriptionStatus, } = dto;
        const where = {
            firstName: name?.trim()
                ? {
                    contains: name.trim(),
                    mode: "insensitive",
                }
                : undefined,
            phoneNumber: phoneNumber?.trim()
                ? {
                    contains: phoneNumber.trim(),
                    mode: "insensitive",
                }
                : undefined,
            telegramId: telegramId?.trim()
                ? {
                    contains: telegramId.trim(),
                    mode: "insensitive",
                }
                : undefined,
            status: status || undefined,
            subscription: subscriptionTypeId
                ? {
                    some: {
                        subscriptionType: {
                            id: subscriptionTypeId,
                        },
                        expiredDate: subscriptionStatus !== undefined
                            ? subscriptionStatus === "EXPIRED"
                                ? { lt: new Date() }
                                : { gt: new Date() }
                            : undefined,
                    },
                }
                : undefined,
        };
        let [data, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    subscription: { include: { subscriptionType: true } },
                    messageUser: true,
                    transaction: true,
                },
            }),
            this.prisma.user.count({ where }),
        ]);
        data = data.map((user) => {
            return {
                ...user,
                subscriptionTitle: user.subscription[0]?.subscriptionType.title,
                subscriptonExpiredDate: user.subscription[0]?.expiredDate,
            };
        });
        return {
            total,
            page,
            limit,
            data,
        };
    }
    async getSubscription(telegramId, checkStatus = true) {
        const subscription = await this.prisma.subscription.findFirst({
            where: {
                user: {
                    telegramId: telegramId.toString(),
                    status: checkStatus ? "SUBSCRIBE" : undefined,
                },
                expiredDate: {
                    gt: new Date(),
                },
            },
            include: { subscriptionType: true, user: true, transaction: true },
        });
        return subscription;
    }
    async cancelSubscription(telegramId) {
        let user = await this.prisma.user.findUnique({ where: { telegramId } });
        if (!user)
            throw new http_error_1.HttpError({ message: "USER_NOT_FOUND" });
        if (user.status === "UNSUBSCRIBE")
            throw new http_error_1.HttpError({ message: "ALREADY_UNSUBSCRIBED" });
        if (user.status !== "SUBSCRIBE")
            throw new http_error_1.HttpError({ message: "NOT_SUBSCRIBED" });
        user = await this.prisma.user.update({
            where: { id: user.id },
            data: { status: "UNSUBSCRIBE" },
        });
        return user;
    }
    async uncancelSubscription(telegramId) {
        const canceledSubscription = await this.getSubscription(+telegramId, false);
        if (!canceledSubscription)
            throw new http_error_1.HttpError({ message: "NOT_CANCELED_SUBSCRIPTION" });
        return await this.update(canceledSubscription.user.id, {
            status: "SUBSCRIBE",
        });
    }
    async findOneByTelegramID(id) {
        const user = await this.prisma.user.findFirst({
            where: { telegramId: id },
        });
        if (!user) {
            return null;
        }
        return user;
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id: id },
            include: {
                messageUser: { include: { message: true } },
                subscription: { include: { subscriptionType: true } },
                transaction: true,
            },
        });
        if (!user) {
            throw (0, http_error_1.HttpError)({ code: "User not found" });
        }
        return user;
    }
    async update(id, updateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw (0, http_error_1.HttpError)({ code: "User not found" });
        }
        if (updateUserDto.phoneNumber) {
            const phoneExists = await this.prisma.user.findUnique({
                where: { phoneNumber: updateUserDto.phoneNumber },
            });
            if (phoneExists && phoneExists.id !== id) {
                throw (0, http_error_1.HttpError)({ code: "User with this phone number already exists" });
            }
        }
        if (updateUserDto.email) {
            const emailExists = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email },
            });
            if (emailExists && emailExists.id !== id) {
                throw (0, http_error_1.HttpError)({ code: "User with this email already exists" });
            }
        }
        const updateData = {
            firstName: updateUserDto.firstName ?? user.firstName,
            email: updateUserDto.email ?? user.email,
            lastName: updateUserDto.lastName ?? user.lastName,
            phoneNumber: updateUserDto.phoneNumber ?? user.phoneNumber,
            status: updateUserDto.status ?? user.status,
            inGroup: updateUserDto.inGroup ?? user.inGroup,
            lastActiveAt: updateUserDto.lastActiveAt ?? user.lastActiveAt,
        };
        return this.prisma.user.update({
            where: { id },
            data: updateData,
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map