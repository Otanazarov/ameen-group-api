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
exports.AtmosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("../../common/config");
const axios_1 = require("../../common/utils/axios");
const transaction_service_1 = require("../trasnaction/transaction.service");
const client_1 = require("@prisma/client");
const http_error_1 = require("../../common/exception/http.error");
const telegram_service_1 = require("../telegram/telegram.service");
let AtmosService = class AtmosService {
    constructor(prisma, transactionService, telegramService) {
        this.prisma = prisma;
        this.transactionService = transactionService;
        this.telegramService = telegramService;
    }
    async createLink(dto) {
        const { userId, subscriptionTypeId } = dto;
        if (!userId || !subscriptionTypeId) {
            throw new Error('Missing userId or subscriptionTypeId');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const subscriptionType = await this.prisma.subscriptionType.findUnique({
            where: { id: subscriptionTypeId },
        });
        if (!subscriptionType) {
            throw new Error('Subscription type not found');
        }
        try {
            var res = await axios_1.atmosApi.post('merchant/pay/create', {
                store_id: config_1.env.ATMOS_STORE_ID,
                account: user.id,
                amount: (subscriptionType.price * 100).toString(),
                details: subscriptionType.id.toString(),
                lang: 'en',
            });
        }
        catch (e) {
            throw new Error('Error creating transaction');
        }
        console.log(res.config.url);
        console.log({
            store_id: config_1.env.ATMOS_STORE_ID,
            account: user.id,
            amount: (subscriptionType.price * 100).toString(),
            details: subscriptionType.id.toString(),
            lang: 'en',
        });
        console.log(res.data);
        if (!res.data?.transaction_id)
            throw new Error('Transaction ID not found');
        const transactionId = res.data.transaction_id;
        const transaction = await this.transactionService.create({
            userId: user.id,
            subscriptionTypeId,
            price: subscriptionType.price,
            paymentType: 'ATMOS',
            status: 'Created',
            transactionId: transactionId.toString(),
        });
        return transaction;
    }
    async preApplyTransaction(dto) {
        const preApplyData = {
            transaction_id: dto.transaction_id,
            card_number: dto.card_number,
            expiry: dto.expiry,
            store_id: config_1.env.ATMOS_STORE_ID,
        };
        const result = await axios_1.atmosApi.post('/merchant/pay/pre-apply', preApplyData);
        if (result.data.result.code !== 'OK') {
            throw new http_error_1.HttpError({ message: result.data.result.description });
        }
        return result.data;
    }
    async applyTransaction(dto) {
        const applyData = {
            transaction_id: dto.transaction_id.toString(),
            otp: dto.otp,
            store_id: config_1.env.ATMOS_STORE_ID,
        };
        const result = await axios_1.atmosApi.post('/merchant/pay/apply', applyData);
        if (result.data.result.code === 'OK') {
            const subscription = await this.transactionService.findOneByTransactionId(result.data.store_transaction.trans_id.toString());
            await this.transactionService.update(subscription.id, {
                status: client_1.TransactionStatus.Paid,
            });
            return {
                redirect: `https://t.me/${this.telegramService.bot.botInfo.username}?start=success`,
            };
        }
        else {
            throw new http_error_1.HttpError({ message: result.data.result.description });
        }
    }
    async getPendingInvoices() {
        return this.prisma.transaction.findMany({
            where: {
                status: client_1.TransactionStatus.Created,
                paymentType: 'ATMOS',
                createdAt: {
                    gt: new Date(Date.now() - 1000 * 60 * 30),
                },
            },
        });
    }
    async checkTransactionStatus(transactionId) {
        const { data } = await axios_1.atmosApi.post('/merchant/pay/get', {
            store_id: +config_1.env.ATMOS_STORE_ID,
            transaction_id: +transactionId,
        });
        const transaction = await this.transactionService.findOneByTransactionId(transactionId);
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        const isSuccess = data.store_transaction?.confirmed === true &&
            data.store_transaction?.status_message === 'Success';
        if (isSuccess) {
            await this.transactionService.update(transaction.id, { status: 'Paid' });
        }
        else if (data.store_transaction?.status_message === 'Canceled' ||
            data.result?.code === 'STPIMS-ERR-092') {
            await this.transactionService.update(transaction.id, {
                status: 'Canceled',
            });
        }
        return data;
    }
};
exports.AtmosService = AtmosService;
exports.AtmosService = AtmosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        transaction_service_1.TransactionService,
        telegram_service_1.TelegramService])
], AtmosService);
//# sourceMappingURL=atmos.service.js.map