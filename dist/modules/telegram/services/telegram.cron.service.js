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
var TelegramCronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramCronService = void 0;
const nestjs_1 = require("@grammyjs/nestjs");
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const grammy_1 = require("grammy");
const config_1 = require("../../../common/config");
const atmos_service_1 = require("../../atmos/atmos.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const user_service_1 = require("../../user/user.service");
const telegram_sender_service_1 = require("./telegram.sender.service");
const telegram_subscription_service_1 = require("./telegram.subscription.service");
let TelegramCronService = TelegramCronService_1 = class TelegramCronService {
    constructor(bot, prismaService, userService, senderService, subscriptionService, atmosService) {
        this.bot = bot;
        this.prismaService = prismaService;
        this.userService = userService;
        this.senderService = senderService;
        this.subscriptionService = subscriptionService;
        this.atmosService = atmosService;
        this.cronRunning = false;
        this.MS_PER_DAY = 1000 * 60 * 60 * 24;
        this.logger = new common_1.Logger(TelegramCronService_1.name);
    }
    async onCron() {
        if (this.cronRunning)
            return;
        this.cronRunning = true;
        await this.kickExpired();
        await this.sendAlertMessage();
        await this.senderService.sendMessages();
        this.cronRunning = false;
    }
    async sendAlertMessage() {
        const users = await this.prismaService.user.findMany({
            where: {
                inGroup: true,
                status: 'SUBSCRIBE',
                subscription: {
                    some: {
                        expiredDate: { gt: new Date(Date.now() - this.MS_PER_DAY * 3) },
                    },
                },
            },
            include: { subscription: true },
        });
        for (const user of users) {
            const sub = await this.userService.getSubscription(+user.telegramId);
            if (!sub)
                continue;
            const daysLeft = this.subscriptionService.calculateDaysLeft(sub.expiredDate);
            if (daysLeft > 0 && daysLeft <= 3 && sub.alertCount <= 3 - daysLeft) {
                const settings = await this.prismaService.settings.findFirst({
                    where: { id: 1 },
                });
                const text = settings.alertMessage
                    .replace('{{daysLeft}}', daysLeft.toString())
                    .replace('{{expireDate}}', sub.expiredDate.toDateString());
                await this.bot.api.sendMessage(+user.telegramId, text);
                await this.prismaService.subscription.update({
                    where: { id: sub.id },
                    data: { alertCount: sub.alertCount + 1 },
                });
            }
        }
    }
    async handleExpiredTrials() {
        this.logger.log('Running cron job to handle expired trials');
        const expiredTrialSubscriptions = await this.prismaService.subscription.findMany({
            where: {
                expiredDate: {
                    lte: new Date()
                },
                user: {
                    status: 'TRIAL'
                }
            },
            include: {
                user: true,
            },
        });
        if (expiredTrialSubscriptions.length === 0) {
            return;
        }
        const cheapestSubscriptionType = await this.prismaService.subscriptionType.findFirst({
            where: { isDeleted: false, oneTime: false, price: { gt: 0 } },
            orderBy: { price: 'asc' },
        });
        if (!cheapestSubscriptionType) {
            this.logger.warn('No subscription types found to convert trials.');
            return;
        }
        for (const subscription of expiredTrialSubscriptions) {
            try {
                await this.atmosService.createSubscriptionScheduler(subscription.userId, cheapestSubscriptionType.id);
                this.logger.log(`Successfully created subscription scheduler for user ${subscription.userId}`);
            }
            catch (error) {
                this.logger.error(`Failed to convert trial for user ${subscription.userId}: ${error.message}`);
            }
        }
    }
    async kickExpired() {
        const users = await this.prismaService.user.findMany({
            where: {
                inGroup: true,
                status: 'SUBSCRIBE',
                subscription: { every: { expiredDate: { lte: new Date() } } },
            },
        });
        for (const user of users) {
            await this.userService.update(user.id, {
                inGroup: false,
                status: 'EXPIRED',
            });
            this.bot.api.banChatMember(config_1.env.TELEGRAM_GROUP_ID, +user.telegramId);
            this.bot.api.unbanChatMember(config_1.env.TELEGRAM_GROUP_ID, +user.telegramId);
        }
    }
};
exports.TelegramCronService = TelegramCronService;
__decorate([
    (0, schedule_1.Interval)(10000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TelegramCronService.prototype, "onCron", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TelegramCronService.prototype, "handleExpiredTrials", null);
exports.TelegramCronService = TelegramCronService = TelegramCronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectBot)()),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => telegram_sender_service_1.TelegramSenderService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => telegram_subscription_service_1.TelegramSubscriptionService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => atmos_service_1.AtmosService))),
    __metadata("design:paramtypes", [grammy_1.Bot,
        prisma_service_1.PrismaService,
        user_service_1.UserService,
        telegram_sender_service_1.TelegramSenderService,
        telegram_subscription_service_1.TelegramSubscriptionService,
        atmos_service_1.AtmosService])
], TelegramCronService);
//# sourceMappingURL=telegram.cron.service.js.map