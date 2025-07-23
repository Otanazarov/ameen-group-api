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
exports.OctoBankService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const telegram_service_1 = require("../telegram/telegram.service");
const transaction_service_1 = require("../trasnaction/transaction.service");
const octobank_dto_1 = require("./dto/octobank.dto");
const uuid_1 = require("uuid");
const axios_1 = require("axios");
const config_1 = require("../../common/config");
let OctoBankService = class OctoBankService {
    constructor(prisma, transactionService, telegramService) {
        this.prisma = prisma;
        this.transactionService = transactionService;
        this.telegramService = telegramService;
    }
    format(date) {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    }
    async createCheckoutSession(dto) {
        const { userId, subscriptionTypeId } = dto;
        const subscriptionType = await this.prisma.subscriptionType.findFirst({
            where: {
                id: subscriptionTypeId,
            },
        });
        const user = await this.prisma.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        if (!subscriptionType) {
            throw new Error('Subscription type not found');
        }
        const botUsername = this.telegramService.bot.botInfo.username;
        const transaction = await this.transactionService.create({
            subscriptionTypeId,
            userId,
            transactionId: (0, uuid_1.v4)(),
            status: client_1.TransactionStatus.Created,
            paymentType: client_1.PaymentType.OCTOBANK,
            price: subscriptionType.price,
        });
        console.log('sending request');
        const session = await axios_1.default.post('https://secure.octo.uz/prepare_payment', {
            octo_shop_id: config_1.env.OCTOBANK_SHOP_ID,
            octo_secret: config_1.env.OCTOBANK_SECRET_KEY,
            shop_transaction_id: transaction.transactionId,
            auto_capture: true,
            test: true,
            init_time: this.format(new Date()),
            user_data: {
                user_id: user.id,
                phone: user.phoneNumber,
                email: user.email || 'empty',
            },
            total_sum: transaction.price,
            currency: 'UZS',
            description: 'TEST_PAYMENT',
            basket: [
                {
                    position_desc: subscriptionType.title,
                    count: 1,
                    price: transaction.price,
                    spic: transaction.subscriptionTypeId,
                },
            ],
            payment_methods: [
                {
                    method: 'bank_card',
                },
                {
                    method: 'uzcard',
                },
                {
                    method: 'humo',
                },
            ],
            tsp_id: 18,
            return_url: `https://t.me/${botUsername}?start=success`,
            notify_url: `${config_1.env.BACKEND_URL}/api/octobank`,
            language: 'uz',
            ttl: 15,
        });
        console.log('session', session);
        return session.data;
    }
    async webhook(dto) {
        if (dto.status === octobank_dto_1.OctobankStatus.succeeded) {
            const transaction = await this.prisma.transaction.findFirst({
                where: {
                    transactionId: dto.shop_transaction_id.toString(),
                },
            });
            if (!transaction) {
                throw new Error('Transaction not found');
            }
            await this.transactionService.update(transaction.id, {
                status: client_1.TransactionStatus.Paid,
            });
            return true;
        }
    }
};
exports.OctoBankService = OctoBankService;
exports.OctoBankService = OctoBankService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => telegram_service_1.TelegramService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        transaction_service_1.TransactionService,
        telegram_service_1.TelegramService])
], OctoBankService);
//# sourceMappingURL=octobank.service.js.map