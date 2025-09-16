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
exports.TelegramCallbackService = void 0;
const nestjs_1 = require("@grammyjs/nestjs");
const common_1 = require("@nestjs/common");
const grammy_1 = require("grammy");
const grammy_2 = require("grammy");
const path_1 = require("path");
const config_1 = require("../../../common/config");
const message_service_1 = require("../../message/message.service");
const settings_service_1 = require("../../settings/settings.service");
const subscription_type_service_1 = require("../../subscription-type/subscription-type.service");
const user_service_1 = require("../../user/user.service");
const telegram_sender_service_1 = require("./telegram.sender.service");
const telegram_subscription_service_1 = require("./telegram.subscription.service");
let TelegramCallbackService = class TelegramCallbackService {
    constructor(bot, userService, subscriptionTypeService, settingsService, messageService, subscriptionService, senderService) {
        this.bot = bot;
        this.userService = userService;
        this.subscriptionTypeService = subscriptionTypeService;
        this.settingsService = settingsService;
        this.messageService = messageService;
        this.subscriptionService = subscriptionService;
        this.senderService = senderService;
    }
    async onReactionCallBack(ctx) {
        const messageId = ctx.match[1];
        await this.messageService.update(+messageId, { status: 'READ' });
        await ctx.answerCallbackQuery('✅ Reaksiya bildirildi');
    }
    async onSubscribeCallBack(ctx) {
        const subscriptionTypeId = +ctx.match[1];
        const result = await this.subscriptionService.handleSubscriptionPayment(ctx, subscriptionTypeId);
        if (!result)
            return;
        await this.senderService.sendSubscriptionPaymentInfo(ctx, result);
    }
    async onEditCallBack(ctx) {
        const editName = ctx.match[1];
        ctx.session.edit = editName;
        const backKeyboard = new grammy_1.InlineKeyboard().text('⬅️ Orqaga', 'settings');
        let text = '';
        if (editName == 'firstname') {
            text = '👤 Yangi ismni kiriting';
        }
        else if (editName == 'lastname') {
            text = '👥 Yangi familyani kiriting';
        }
        else if (editName == 'email') {
            text = '📧 Yangi emailni kiriting';
        }
        const message = await ctx.editMessageText(text, {
            reply_markup: backKeyboard,
        });
        if (typeof message === 'object') {
            ctx.session.message_id = message.message_id;
        }
    }
    async onSettingsCallBack(ctx) {
        delete ctx.session.edit;
        await this.senderService.sendSettingsMessage(ctx);
    }
    async onSubscriptionMenuCallBack(ctx) {
        await this.senderService.sendSubscriptionMenu(ctx);
    }
    async onStartMessageCallBack(ctx) {
        const text = (await this.settingsService.findOne()).startMessage;
        try {
            await ctx.editMessageText(text, {
                reply_markup: this.senderService.DEFAULT_KEYBOARD,
            });
        }
        catch (e) {
            await ctx.deleteMessage();
            await ctx.reply(text, {
                reply_markup: this.senderService.DEFAULT_KEYBOARD,
            });
        }
    }
    async onCancelSubscriptionCallBack(ctx) {
        const subscription = await this.userService.getSubscription(ctx.from.id);
        if (!subscription) {
            await ctx.answerCallbackQuery({
                text: '❌ Sizda hozircha faol obuna mavjud emas',
                show_alert: true,
            });
            return;
        }
        try {
            const user = await this.userService.cancelSubscription(ctx.from.id.toString());
            try {
                await ctx.api.banChatMember(config_1.env.TELEGRAM_GROUP_ID, ctx.from.id);
            }
            catch { }
            await this.userService.update(user.id, { inGroup: false });
            await ctx.answerCallbackQuery({ text: 'Obuna bekor qilindi' });
            await this.onStartMessageCallBack(ctx);
        }
        catch (e) {
            console.log(e);
            await ctx.answerCallbackQuery({
                text: 'Obuna bekor qilishda muomoga chiqdi',
            });
        }
    }
    async onUncancelSubscriptionCallBack(ctx) {
        const subscription = await this.userService.getSubscription(ctx.from.id, false);
        if (!subscription) {
            await ctx.answerCallbackQuery({
                text: '❌ Sizda obuna mavjud emas',
                show_alert: true,
            });
            return;
        }
        try {
            await this.userService.uncancelSubscription(ctx.from.id.toString());
            await ctx.answerCallbackQuery({ text: 'Obuna tiklandi' });
            const link = await ctx.api.createChatInviteLink(config_1.env.TELEGRAM_GROUP_ID, {
                name: ctx.from.first_name,
                creates_join_request: true,
            });
            await ctx.reply("🎉 Guruhga qo'shilish uchun havola: " + link.invite_link);
            await this.onStartMessageCallBack(ctx);
        }
        catch (e) {
            console.log(e);
            await ctx.answerCallbackQuery({
                text: 'Obuna tiklashda muomoga chiqdi',
            });
        }
    }
    async onMySubscriptionsCallBack(ctx) {
        const subscription = await this.userService.getSubscription(ctx.from.id);
        const keyboard = new grammy_1.InlineKeyboard();
        if (!subscription) {
            const canceledSubscription = await this.userService.getSubscription(ctx.from.id, false);
            if (canceledSubscription) {
                keyboard.text('Obunani Tiklash', 'uncancel_subscription');
                keyboard.row();
            }
            keyboard.text('⬅️ Orqaga', 'start_message');
            await ctx.editMessageText('❌ Sizda hozircha faol obuna mavjud emas', {
                reply_markup: keyboard,
            });
            return;
        }
        keyboard.text('Bekor Qilish', 'cancel_subscription');
        keyboard.row();
        keyboard.text('⬅️ Orqaga', 'start_message');
        const daysLeft = this.subscriptionService.calculateDaysLeft(subscription.expiredDate);
        const subscriptionType = await this.subscriptionTypeService.findOne(subscription.subscriptionTypeId);
        const text = `📌 Obuna turi: ${subscriptionType.title}
` +
            `💰 Narxi: ${subscriptionType.price} so'm
` +
            `📅 Tugash sanasi: ${subscription.expiredDate.toLocaleDateString()}
` +
            `⏳ Qolgan kunlar: ${daysLeft} kun`;
        await ctx.editMessageText(text, { reply_markup: keyboard });
    }
    async onAboutUsCallBack(ctx) {
        const settings = await this.settingsService.findOne();
        const keyboard = new grammy_1.InlineKeyboard().text('⬅️ Orqaga', 'start_message');
        try {
            if (settings.aboutAminGroupImage) {
                const filePath = (0, path_1.join)(__dirname, '..', '..', '..', 'public', settings.aboutAminGroupImage.url);
                await ctx.editMessageMedia(grammy_1.InputMediaBuilder.photo(new grammy_1.InputFile(filePath), {
                    caption: settings.aboutAminGroup,
                    parse_mode: 'Markdown',
                }), { reply_markup: keyboard });
            }
            else {
                await ctx.editMessageText(settings.aboutAminGroup, {
                    parse_mode: 'Markdown',
                    reply_markup: keyboard,
                });
            }
        }
        catch (e) {
            await ctx.deleteMessage().catch(() => { });
            if (settings.aboutAminGroupImage) {
                const filePath = (0, path_1.join)(__dirname, '..', '..', '..', 'public', settings.aboutAminGroupImage.url);
                await ctx.replyWithPhoto(new grammy_1.InputFile(filePath), {
                    caption: settings.aboutAminGroup,
                    parse_mode: 'Markdown',
                });
            }
            else {
                await ctx.reply(settings.aboutAminGroup, {
                    parse_mode: 'Markdown',
                });
            }
        }
    }
    async onAboutContactCallBack(ctx) {
        const settings = await this.settingsService.findOne();
        const keyboard = new grammy_1.InlineKeyboard().text('⬅️ Orqaga', 'start_message');
        try {
            if (settings.contactImage) {
                const filePath = (0, path_1.join)(__dirname, '..', '..', '..', 'public', settings.contactImage.url);
                await ctx.editMessageMedia(grammy_1.InputMediaBuilder.photo(new grammy_1.InputFile(filePath), {
                    caption: settings.contactMessage,
                    parse_mode: 'Markdown',
                }), { reply_markup: keyboard });
            }
            else {
                await ctx.editMessageText(settings.contactMessage, {
                    parse_mode: 'Markdown',
                    reply_markup: keyboard,
                });
            }
        }
        catch (e) {
            await ctx.deleteMessage().catch(() => { });
            if (settings.contactImage) {
                const filePath = (0, path_1.join)(__dirname, '..', '..', '..', 'public', settings.contactImage.url);
                await ctx.replyWithPhoto(new grammy_1.InputFile(filePath), {
                    caption: settings.contactMessage,
                    parse_mode: 'Markdown',
                });
            }
            else {
                await ctx.reply(settings.contactMessage, {
                    parse_mode: 'Markdown',
                });
            }
        }
    }
};
exports.TelegramCallbackService = TelegramCallbackService;
exports.TelegramCallbackService = TelegramCallbackService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectBot)()),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => message_service_1.MessageService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => telegram_subscription_service_1.TelegramSubscriptionService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => telegram_sender_service_1.TelegramSenderService))),
    __metadata("design:paramtypes", [grammy_2.Bot,
        user_service_1.UserService,
        subscription_type_service_1.SubscriptionTypeService,
        settings_service_1.SettingsService,
        message_service_1.MessageService,
        telegram_subscription_service_1.TelegramSubscriptionService,
        telegram_sender_service_1.TelegramSenderService])
], TelegramCallbackService);
//# sourceMappingURL=telegram.callback.service.js.map