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
exports.TelegramMessageService = void 0;
const nestjs_1 = require("@grammyjs/nestjs");
const common_1 = require("@nestjs/common");
const grammy_1 = require("grammy");
const config_1 = require("../../../common/config");
const user_service_1 = require("../../user/user.service");
const telegram_registration_service_1 = require("./telegram.registration.service");
const telegram_sender_service_1 = require("./telegram.sender.service");
const telegram_settings_service_1 = require("./telegram.settings.service");
let TelegramMessageService = class TelegramMessageService {
    constructor(bot, userService, senderService, settingsService, registrationService) {
        this.bot = bot;
        this.userService = userService;
        this.senderService = senderService;
        this.settingsService = settingsService;
        this.registrationService = registrationService;
    }
    async handleStartCommand(ctx) {
        const user = await this.userService.findOneByTelegramID(ctx.from.id.toString());
        if (!user) {
            ctx.session = {};
            this.senderService.sendNameRequest(ctx, 1);
            return true;
        }
        const subscription = await this.userService.getSubscription(+user.telegramId);
        if (subscription && !user.inGroup) {
            const link = await ctx.api.createChatInviteLink(config_1.env.TELEGRAM_GROUP_ID, {
                name: ctx.from.first_name,
                creates_join_request: true,
            });
            await ctx.reply("🎉 Guruhga qo'shilish uchun havola: " + link.invite_link);
            return true;
        }
        this.senderService.sendStartMessage(ctx);
        return true;
    }
    async onMessage(ctx) {
        if (ctx.chat.type != 'private')
            return;
        if (!ctx.session.id && (await this.registrationService.handleExistingUser(ctx)))
            return;
        if (ctx.message.text?.startsWith('/') &&
            (await this.handleStartCommand(ctx)))
            return;
        if (await this.settingsService.handleEdit(ctx))
            return;
        if (await this.registrationService.handleUserRegistration(ctx))
            return;
        if (await this.registrationService.handlePhoneNumber(ctx))
            return;
    }
};
exports.TelegramMessageService = TelegramMessageService;
exports.TelegramMessageService = TelegramMessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectBot)()),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => telegram_sender_service_1.TelegramSenderService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => telegram_settings_service_1.TelegramSettingsService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => telegram_registration_service_1.TelegramRegistrationService))),
    __metadata("design:paramtypes", [grammy_1.Bot,
        user_service_1.UserService,
        telegram_sender_service_1.TelegramSenderService,
        telegram_settings_service_1.TelegramSettingsService,
        telegram_registration_service_1.TelegramRegistrationService])
], TelegramMessageService);
//# sourceMappingURL=telegram.message.service.js.map