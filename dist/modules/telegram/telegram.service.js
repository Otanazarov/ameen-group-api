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
exports.TelegramService = void 0;
const nestjs_1 = require("@grammyjs/nestjs");
const common_1 = require("@nestjs/common");
const grammy_1 = require("grammy");
const telegram_callback_service_1 = require("./services/telegram.callback.service");
const telegram_cron_service_1 = require("./services/telegram.cron.service");
const telegram_message_service_1 = require("./services/telegram.message.service");
const telegram_registration_service_1 = require("./services/telegram.registration.service");
const telegram_sender_service_1 = require("./services/telegram.sender.service");
let TelegramService = class TelegramService {
    constructor(bot, senderService, callbackService, registrationService, cronService, messageService) {
        this.bot = bot;
        this.senderService = senderService;
        this.callbackService = callbackService;
        this.registrationService = registrationService;
        this.cronService = cronService;
        this.messageService = messageService;
    }
    async onModuleInit() {
        await this.senderService.setDefaultKeyboard();
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectBot)()),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => telegram_sender_service_1.TelegramSenderService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => telegram_callback_service_1.TelegramCallbackService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => telegram_registration_service_1.TelegramRegistrationService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => telegram_cron_service_1.TelegramCronService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => telegram_message_service_1.TelegramMessageService))),
    __metadata("design:paramtypes", [grammy_1.Bot,
        telegram_sender_service_1.TelegramSenderService,
        telegram_callback_service_1.TelegramCallbackService,
        telegram_registration_service_1.TelegramRegistrationService,
        telegram_cron_service_1.TelegramCronService,
        telegram_message_service_1.TelegramMessageService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map