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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const http_error_1 = require("../../common/exception/http.error");
const client_1 = require("@prisma/client");
let MessageService = class MessageService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createMessageDto) {
        const { userIds, status, text, subscriptionTypeId, buttonPlacements, fileIds, } = createMessageDto;
        const orConditions = [];
        if (status) {
            orConditions.push({ status: { equals: status } });
        }
        if (userIds?.length) {
            orConditions.push({ id: { in: userIds } });
        }
        if (subscriptionTypeId) {
            orConditions.push({
                subscription: {
                    some: { subscriptionType: { id: subscriptionTypeId } },
                },
            });
        }
        const users = await this.prisma.user.findMany({
            where: orConditions.length > 0 ? { OR: orConditions } : {},
            include: {
                subscription: {
                    where: {
                        subscriptionType: {
                            id: subscriptionTypeId,
                        },
                    },
                },
            },
        });
        const message = await this.prisma.message.create({
            data: {
                text,
                files: {
                    connect: fileIds?.map((id) => ({ id })) || [],
                },
                buttonPlacement: {
                    create: buttonPlacements?.map((placement) => ({
                        buttonId: placement.buttonId,
                        row: placement.row,
                        column: placement.column,
                    })),
                },
            },
        });
        for (const user of users) {
            if (!user.telegramId)
                continue;
            await this.prisma.messageUser.create({
                data: {
                    userId: user.id,
                    status: client_1.MessageStatus.PENDING,
                    messageId: message.id,
                },
                include: { user: true, message: true },
            });
        }
        return message;
    }
    async findAll(dto) {
        const { page = 1, limit = 10, text } = dto;
        const skip = (page - 1) * limit;
        const where = {
            text: text?.trim()
                ? {
                    contains: text.trim(),
                    mode: 'insensitive',
                }
                : undefined,
        };
        let [data, total] = await this.prisma.$transaction([
            this.prisma.message.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: { select: { users: true } },
                },
            }),
            this.prisma.message.count({ where }),
        ]);
        data = data.map((message) => {
            return {
                ...message,
                users: message._count.users,
                _count: undefined,
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
        const [data, total] = await this.prisma.$transaction([
            this.prisma.messageUser.findMany({
                where: { user: { id: userId } },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { message: true },
            }),
            this.prisma.messageUser.count({ where: { user: { id: userId } } }),
        ]);
        return {
            total,
            page,
            limit,
            data,
        };
    }
    async findAllUser(dto) {
        const { page = 1, limit = 10, status } = dto;
        const skip = (page - 1) * limit;
        const where = {
            status: status ? { equals: status } : undefined,
        };
        let [data, total] = await this.prisma.$transaction([
            this.prisma.messageUser.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: true,
                    message: true,
                },
            }),
            this.prisma.messageUser.count({ where }),
        ]);
        return {
            total,
            page,
            limit,
            data,
        };
    }
    async findOne(id) {
        const message = await this.prisma.message.findUnique({
            where: {
                id,
            },
            include: { users: true, buttonPlacement: { include: { button: true } } },
        });
        if (!message) {
            throw (0, http_error_1.HttpError)({ code: 404, message: 'Message not found' });
        }
        return message;
    }
    async findOneUser(id) {
        const message = await this.prisma.messageUser.findUnique({
            where: {
                id,
            },
        });
        if (!message) {
            throw (0, http_error_1.HttpError)({ code: 404, message: 'Message not found' });
        }
        return message;
    }
    async update(id, updateMessageDto) {
        const message = await this.prisma.messageUser.findUnique({
            where: {
                id,
            },
        });
        if (!message) {
            throw (0, http_error_1.HttpError)({ code: 404, message: 'Message not found' });
        }
        const updatedMessage = await this.prisma.messageUser.update({
            where: {
                id,
            },
            data: {
                status: updateMessageDto.status,
            },
        });
        return updatedMessage;
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessageService);
//# sourceMappingURL=message.service.js.map