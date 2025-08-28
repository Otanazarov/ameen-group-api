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
exports.TelegramUpdate = void 0;
const nestjs_1 = require("@grammyjs/nestjs");
const grammy_1 = require("grammy");
const config_1 = require("../../common/config");
const user_service_1 = require("../user/user.service");
const telegram_service_1 = require("./telegram.service");
let TelegramUpdate = class TelegramUpdate {
    constructor(bot, telegramService, userService) {
        this.bot = bot;
        this.telegramService = telegramService;
        this.userService = userService;
        console.log('telegram Bot starting', this.bot ? this.bot.botInfo.id : '(booting)');
        bot.catch((err) => {
            console.log('Error in telegram bot', err);
            return true;
        });
        bot.use((ctx, next) => {
            if (ctx.session.id)
                this.userService.update(ctx.session.id, { lastActiveAt: new Date() });
            next();
        });
    }
    async onTopicId(ctx) {
        ctx.reply(`Topic id: \`\`\`${ctx.message.message_thread_id}\`\`\``, {
            message_thread_id: ctx.message.message_thread_id,
            parse_mode: 'Markdown',
        });
    }
    async onId(ctx) {
        ctx.reply(`chat id: \`\`\`${ctx.chat.id}\`\`\``, {
            message_thread_id: ctx.message.message_thread_id,
            parse_mode: 'Markdown',
        });
    }
    async logout(ctx) {
        ctx.session = {};
    }
    async onSubscribeCallbackQuery(ctx) {
        this.telegramService.onSubscribeCallBack(ctx);
    }
    async onEditCallbackQuery(ctx) {
        this.telegramService.onEditCallBack(ctx);
    }
    async onReactionCallbackQuery(ctx) {
        this.telegramService.onReactionCallBack(ctx);
    }
    async onSettingsCallbackQuery(ctx) {
        this.telegramService.onSettingsCallBack(ctx);
    }
    async onStartMessageCallbackQuery(ctx) {
        this.telegramService.onStartMessageCallBack(ctx);
    }
    async onSubscriptionMenuCallbackQuery(ctx) {
        this.telegramService.onSubscriptionMenuCallBack(ctx);
    }
    async onCancelSubscriptionCallbackQuery(ctx) {
        this.telegramService.onCancelSubscriptionCallBack(ctx);
    }
    async onMySubscriptionsCallbackQuery(ctx) {
        this.telegramService.onMySubscriptionsCallBack(ctx);
    }
    async onAboutUsCallbackQuery(ctx) {
        this.telegramService.onAboutUsCallBack(ctx);
    }
    async onAboutTeacherCallbackQuery(ctx) {
        this.telegramService.onAboutTeacherCallBack(ctx);
    }
    async onJoin(ctx) {
        const chatMember = ctx.update.chat_join_request;
        if (chatMember.chat.id.toString() !== config_1.env.TELEGRAM_GROUP_ID)
            return;
        const member = chatMember.from;
        const sub = await this.userService.getSubscription(member.id);
        if (sub === null) {
            await ctx.api.declineChatJoinRequest(chatMember.chat.id, member.id);
        }
        else {
            await ctx.api.approveChatJoinRequest(chatMember.chat.id, member.id);
            await this.userService.update(sub.user.id, { inGroup: true });
        }
    }
    async onMessage(ctx) {
        this.telegramService.onMessage(ctx);
    }
};
exports.TelegramUpdate = TelegramUpdate;
__decorate([
    (0, nestjs_1.Command)('topicid'),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onTopicId", null);
__decorate([
    (0, nestjs_1.Command)('id'),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onId", null);
__decorate([
    (0, nestjs_1.Command)('logout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "logout", null);
__decorate([
    (0, nestjs_1.CallbackQuery)(/subscribe-(.+)/),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onSubscribeCallbackQuery", null);
__decorate([
    (0, nestjs_1.CallbackQuery)(/edit_(.+)/),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onEditCallbackQuery", null);
__decorate([
    (0, nestjs_1.CallbackQuery)(/reaction_(.+)/),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onReactionCallbackQuery", null);
__decorate([
    (0, nestjs_1.CallbackQuery)('settings'),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onSettingsCallbackQuery", null);
__decorate([
    (0, nestjs_1.CallbackQuery)('start_message'),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onStartMessageCallbackQuery", null);
__decorate([
    (0, nestjs_1.CallbackQuery)('subscribe_menu'),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onSubscriptionMenuCallbackQuery", null);
__decorate([
    (0, nestjs_1.CallbackQuery)('cancel_subscription'),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onCancelSubscriptionCallbackQuery", null);
__decorate([
    (0, nestjs_1.CallbackQuery)('my_subscriptions'),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onMySubscriptionsCallbackQuery", null);
__decorate([
    (0, nestjs_1.CallbackQuery)('about_us'),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onAboutUsCallbackQuery", null);
__decorate([
    (0, nestjs_1.CallbackQuery)('about_owner'),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onAboutTeacherCallbackQuery", null);
__decorate([
    (0, nestjs_1.On)('chat_join_request'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onJoin", null);
__decorate([
    (0, nestjs_1.On)('message'),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onMessage", null);
exports.TelegramUpdate = TelegramUpdate = __decorate([
    (0, nestjs_1.Update)(),
    __param(0, (0, nestjs_1.InjectBot)()),
    __metadata("design:paramtypes", [grammy_1.Bot,
        telegram_service_1.TelegramService,
        user_service_1.UserService])
], TelegramUpdate);
//# sourceMappingURL=telegram.update.js.map