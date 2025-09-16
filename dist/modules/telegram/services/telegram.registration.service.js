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
exports.TelegramRegistrationService = void 0;
const nestjs_1 = require("@grammyjs/nestjs");
const common_1 = require("@nestjs/common");
const grammy_1 = require("grammy");
const user_service_1 = require("../../user/user.service");
const telegram_sender_service_1 = require("./telegram.sender.service");
let TelegramRegistrationService = class TelegramRegistrationService {
    constructor(bot, userService, senderService) {
        this.bot = bot;
        this.userService = userService;
        this.senderService = senderService;
    }
    async updateUserSession(ctx, user) {
        ctx.session.id = user.id;
        ctx.session.phone = user.phoneNumber;
        ctx.session.first_name = user.firstName;
        ctx.session.last_name = user.lastName;
        ctx.session.email = user.email || 'skipped';
    }
    async handleExistingUser(ctx) {
        if (ctx.session.id)
            return false;
        const user = await this.userService.findOneByTelegramID(ctx.from.id.toString());
        if (user) {
            await this.updateUserSession(ctx, user);
            return false;
        }
        return false;
    }
    async handleUserRegistration(ctx) {
        if (!ctx.session.first_name) {
            ctx.session.first_name = ctx.message.text;
            this.senderService.sendNameRequest(ctx, 2);
            return true;
        }
        if (!ctx.session.last_name) {
            ctx.session.last_name = ctx.message.text;
            this.senderService.sendPhoneRequest(ctx);
            return true;
        }
        return false;
    }
    async handlePhoneNumber(ctx) {
        if (!ctx.session.phone) {
            if (!ctx.message.contact) {
                this.senderService.sendPhoneRequest(ctx);
                return true;
            }
            ctx.session.phone = ctx.message.contact.phone_number;
            let user = (await this.userService.findAll({ phoneNumber: ctx.session.phone })).data[0];
            if (user) {
                ctx.session.email = user.email || 'skipped';
            }
            else {
                user = await this.userService.create({
                    firstName: ctx.session.first_name,
                    lastName: ctx.session.last_name,
                    phoneNumber: ctx.session.phone,
                    username: ctx.from.username,
                    email: ctx.session.email === 'skipped' ? null : ctx.session.email,
                    telegramId: ctx.from.id.toString(),
                });
            }
            ctx.session.id = user.id;
            this.senderService.sendStartMessage(ctx);
            return true;
        }
        return false;
    }
};
exports.TelegramRegistrationService = TelegramRegistrationService;
exports.TelegramRegistrationService = TelegramRegistrationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectBot)()),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => telegram_sender_service_1.TelegramSenderService))),
    __metadata("design:paramtypes", [grammy_1.Bot,
        user_service_1.UserService,
        telegram_sender_service_1.TelegramSenderService])
], TelegramRegistrationService);
//# sourceMappingURL=telegram.registration.service.js.map