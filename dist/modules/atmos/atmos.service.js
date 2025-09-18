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
const dayjs_1 = require("dayjs");
let AtmosService = class AtmosService {
    constructor(prisma, transactionService, telegramService) {
        this.prisma = prisma;
        this.transactionService = transactionService;
        this.telegramService = telegramService;
    }
    async createScheduler(dto) {
        const { data } = await axios_1.atmosApi.post("/pay-scheduler/create", {
            payment: {
                date_start: (0, dayjs_1.default)(dto.date_start).format("YYYY-MM-DD"),
                date_finish: (0, dayjs_1.default)().add(100, "year").format("YYYY-MM-DD"),
                login: dto.login,
                pay_day: dto.pay_day,
                pay_time: "08:00",
                repeat_interval: dto.repeat_interval,
                repeat_times: 999,
                ext_id: dto.ext_id,
                repeat_low_balance: true,
                amount: dto.amount,
                cards: `[${dto.cards.join(",")}]`,
                store_id: config_1.env.ATMOS_STORE_ID,
                account: dto.account,
            },
        });
        return data;
    }
    async confirmScheduler(dto) {
        const { data } = await axios_1.atmosApi.post("/pay-scheduler/confirm", dto);
        return data;
    }
    async deleteScheduler(scheduler_id) {
        const { data } = await axios_1.atmosApi.post("/pay-scheduler/delete", {
            scheduler_id,
        });
        return data;
    }
    async getScheduler(scheduler_id) {
        const { data } = await axios_1.atmosApi.post("/pay-scheduler/get", {
            scheduler_id,
        });
        return data;
    }
    async getSchedulers(login) {
        const { data } = await axios_1.atmosApi.post("/pay-scheduler/get-all", {
            login,
        });
        return data;
    }
    async createSubscriptionScheduler(userId, subscriptionTypeId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.HttpException("User not found", 404);
        }
        const subscriptionType = await this.prisma.subscriptionType.findUnique({
            where: { id: subscriptionTypeId },
        });
        if (!subscriptionType) {
            throw new common_1.HttpException("Subscription type not found", 404);
        }
        const cards = user.cards || [];
        if (cards.length === 0) {
            throw new common_1.HttpException("User has no saved cards. Please add a card first.", 400);
        }
        const transaction = await this.transactionService.create({
            userId: user.id,
            subscriptionTypeId,
            price: subscriptionType.price,
            paymentType: "ATMOS",
            status: "Created",
            transactionId: null,
        });
        const repeat_interval = 1;
        const schedulerData = {
            date_start: new Date(),
            login: user.username,
            pay_day: (0, dayjs_1.default)().date(),
            ext_id: transaction.id.toString(),
            amount: subscriptionType.price * 100,
            cards: cards,
            account: user.id.toString(),
            repeat_interval: repeat_interval,
        };
        const scheduler = await this.createScheduler(schedulerData);
        if (!scheduler.scheduler_id) {
            await this.transactionService.update(transaction.id, {
                status: "Failed",
            });
            throw new common_1.HttpException("Failed to create payment scheduler.", 500);
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { schedulerId: scheduler.scheduler_id.toString() },
        });
        await this.transactionService.update(transaction.id, {
            transactionId: scheduler.scheduler_id.toString(),
        });
        return scheduler;
    }
    async createLink(dto) {
        const { userId, subscriptionTypeId } = dto;
        if (!userId || !subscriptionTypeId) {
            throw new common_1.HttpException("Missing userId or subscriptionTypeId", 400);
        }
        return this.createSubscriptionScheduler(userId, subscriptionTypeId);
    }
    async preApplyTransaction(dto) {
        const preApplyData = {
            transaction_id: dto.transaction_id,
            card_number: dto.card_number,
            expiry: dto.expiry,
            store_id: config_1.env.ATMOS_STORE_ID,
        };
        const result = await axios_1.atmosApi.post("/merchant/pay/pre-apply", preApplyData);
        if (result.data.result.code !== "OK") {
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
        const result = await axios_1.atmosApi.post("/merchant/pay/apply", applyData);
        if (result.data.result.code === "OK") {
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
                paymentType: "ATMOS",
                createdAt: {
                    gt: new Date(Date.now() - 1000 * 60 * 30),
                },
            },
        });
    }
    async checkTransactionStatus(transactionId) {
        const { data } = await axios_1.atmosApi.post("/merchant/pay/get", {
            store_id: +config_1.env.ATMOS_STORE_ID,
            transaction_id: +transactionId,
        });
        const transaction = await this.transactionService.findOneByTransactionId(transactionId);
        if (!transaction) {
            throw new Error("Transaction not found");
        }
        const isSuccess = data.store_transaction?.confirmed === true &&
            data.store_transaction?.status_message === "Success";
        if (isSuccess) {
            await this.transactionService.update(transaction.id, { status: "Paid" });
        }
        else if (data.store_transaction?.status_message === "Canceled" ||
            data.result?.code === "STPIMS-ERR-092") {
            await this.transactionService.update(transaction.id, {
                status: "Canceled",
            });
        }
        return data;
    }
    async bindCardInit(dto) {
        const { data } = await axios_1.atmosApi.post("/partner/bind-card/init", dto);
        return data;
    }
    async bindCardConfirm(dto) {
        const { data } = await axios_1.atmosApi.post("/partner/bind-card/confirm", {
            transaction_id: dto.transaction_id,
            otp: dto.otp,
        });
        let schedulerData = null;
        if (data.result.code == "OK") {
            const user = await this.prisma.user.findUnique({
                where: { id: dto.userId },
            });
            let existingCards = [];
            if (user.cards && Array.isArray(user.cards)) {
                existingCards = user.cards;
            }
            const newCards = [...existingCards, data.data.card_id];
            await this.prisma.user.update({
                where: { id: dto.userId },
                data: {
                    cards: newCards,
                },
            });
            if (dto.subscriptionTypeId) {
                schedulerData = await this.createSubscriptionScheduler(dto.userId, dto.subscriptionTypeId);
            }
        }
        return { cardConfirmData: data, schedulerData };
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