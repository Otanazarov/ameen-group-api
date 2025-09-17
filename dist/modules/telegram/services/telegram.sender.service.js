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
exports.TelegramSenderService = void 0;
const nestjs_1 = require("@grammyjs/nestjs");
const common_1 = require("@nestjs/common");
const grammy_1 = require("grammy");
const path_1 = require("path");
const config_1 = require("../../../common/config");
const message_service_1 = require("../../message/message.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const settings_service_1 = require("../../settings/settings.service");
const subscription_type_service_1 = require("../../subscription-type/subscription-type.service");
const user_service_1 = require("../../user/user.service");
const telegram_button_service_1 = require("./telegram.button.service");
let TelegramSenderService = class TelegramSenderService {
    constructor(bot, prismaService, messageService, userService, settingsService, buttonService, subscriptionTypeService) {
        this.bot = bot;
        this.prismaService = prismaService;
        this.messageService = messageService;
        this.userService = userService;
        this.settingsService = settingsService;
        this.buttonService = buttonService;
        this.subscriptionTypeService = subscriptionTypeService;
    }
    async setDefaultKeyboard() {
        const defaultButtons = await this.buttonService.allButtons;
        const keyboard = new grammy_1.Keyboard();
        keyboard.webApp("🔥 Obuna Bo'lish", `https://turaevkozimxon.uz/atmos/payment?userId=1`);
        defaultButtons
            .filter((b) => b.default)
            .sort((a, b) => a.id - b.id)
            .forEach((button, index) => {
            keyboard.text(button.text);
            if (index % 2 !== 1) {
                keyboard.row();
            }
        });
        this.DEFAULT_KEYBOARD = keyboard.resized();
    }
    async sendMessage(message) {
        try {
            let { text, files } = message.message;
            const replyMarkup = new grammy_1.InlineKeyboard().text('Reaksiya Bildirish', `reaction_${message.id}`);
            const commonOptions = {
                caption: text,
                parse_mode: 'Markdown',
                reply_markup: replyMarkup,
            };
            await this.messageService.update(message.id, { status: 'SENDING' });
            if (files.length > 0) {
                if (files.length == 1) {
                    const file = files[0];
                    const filePath = (0, path_1.join)(__dirname, '..', '..', '..', 'public', file.url);
                    const inputFile = new grammy_1.InputFile(filePath);
                    if (file.mimetype.startsWith('image')) {
                        await this.bot.api.sendPhoto(message.user.telegramId, inputFile, {
                            ...commonOptions,
                        });
                    }
                    else if (file.mimetype.startsWith('video')) {
                        await this.bot.api.sendVideo(message.user.telegramId, inputFile, {
                            ...commonOptions,
                        });
                    }
                    else {
                        await this.bot.api.sendDocument(message.user.telegramId, inputFile, {
                            ...commonOptions,
                        });
                    }
                }
                else {
                    const inputFiles = files.map((file) => {
                        const filePath = (0, path_1.join)(__dirname, '..', '..', '..', 'public', file.url);
                        if (file.mimetype.startsWith('image')) {
                            return grammy_1.InputMediaBuilder.photo(new grammy_1.InputFile(filePath), {
                                ...commonOptions,
                            });
                        }
                        else if (file.mimetype.startsWith('video')) {
                            return grammy_1.InputMediaBuilder.video(new grammy_1.InputFile(filePath), {
                                ...commonOptions,
                            });
                        }
                        else {
                            return grammy_1.InputMediaBuilder.document(new grammy_1.InputFile(filePath), {
                                ...commonOptions,
                            });
                        }
                    });
                    inputFiles[inputFiles.length - 1];
                    await this.bot.api.sendMediaGroup(message.user.telegramId, inputFiles);
                }
            }
            else {
                await this.bot.api.sendMessage(message.user.telegramId, text, {
                    reply_markup: replyMarkup,
                    parse_mode: 'Markdown',
                });
            }
            await this.messageService.update(message.id, { status: 'DELIVERED' });
        }
        catch (e) {
            console.log(e);
            await this.messageService.update(message.id, { status: 'NOTSENT' });
        }
    }
    async sendMessages() {
        const messages = await this.prismaService.messageUser.findMany({
            where: { status: 'PENDING' },
            take: 20,
            include: {
                user: true,
                message: {
                    include: {
                        files: true,
                        buttonPlacement: { include: { button: true } },
                    },
                },
            },
        });
        for (const message of messages) {
            await this.sendMessage(message);
        }
    }
    async sendSubscriptionMenu(ctx) {
        const subscriptionTypes = await this.subscriptionTypeService.findAll({
            limit: 100,
        });
        const keyboard = new grammy_1.InlineKeyboard();
        subscriptionTypes.data.forEach((subscriptionType) => {
            keyboard
                .text(`💫 ${subscriptionType.title} - ${subscriptionType.price} so'm / ${subscriptionType.expireDays} kun`, `subscribe-${subscriptionType.id}`)
                .row();
        });
        keyboard.text('⬅️ Orqaga', 'start_message').row();
        const text = "🔥 Obuna Bo'lish";
        if (subscriptionTypes.data.length == 0) {
            if (ctx.callbackQuery) {
                await ctx.editMessageText("❌ Obunalar mavjud emas iltimos keyinroq urunib ko'ring", { reply_markup: keyboard });
            }
            else {
                await ctx.reply("❌ Obunalar mavjud emas iltimos keyinroq urunib ko'ring", { reply_markup: keyboard });
            }
            return;
        }
        if (ctx.callbackQuery) {
            await ctx.editMessageText(text, { reply_markup: keyboard });
        }
        else {
            await ctx.reply(text, { reply_markup: keyboard });
        }
    }
    async sendSettingsMessage(ctx, messageId) {
        const keyboard = new grammy_1.InlineKeyboard()
            .text("👤 Ismni o'zgartitirish", 'edit_firstname')
            .row()
            .text("👥 Familyani o'zgartitirish", 'edit_lastname')
            .row()
            .text("📧 Emailni o'zgartitirish", 'edit_email')
            .row()
            .text('⬅️ Orqaga', 'start_message');
        const user = await this.userService.findOneByTelegramID(ctx.from.id.toString());
        const text = `⚙️ Sozlamalar

` +
            `👤 Ism: ${user.firstName}
` +
            `👥 Familya: ${user.lastName}
` +
            `📧 Email: ${user.email || 'Kiritilmagan'}
` +
            `📱 Telefon: ${user.phoneNumber}`;
        if (messageId) {
            await this.bot.api.editMessageText(ctx.chat.id, messageId, text, {
                reply_markup: keyboard,
            });
        }
        else if (ctx.callbackQuery) {
            await ctx.editMessageText(text, { reply_markup: keyboard });
        }
        else {
            await ctx.reply(text, { reply_markup: keyboard });
        }
    }
    async sendStartMessage(ctx) {
        await this.setDefaultKeyboard();
        const text = (await this.settingsService.findOne()).startMessage;
        ctx.reply(text, {
            reply_markup: { ...this.DEFAULT_KEYBOARD, remove_keyboard: true },
        });
    }
    sendNameRequest(ctx, step) {
        if (step == 1) {
            ctx.reply(`👤 Iltimos, ismingizni yuboring.`);
        }
        else if (step == 2) {
            ctx.reply(`👥 Iltimos, familiyangizni yuboring.`);
        }
    }
    sendPhoneRequest(ctx) {
        ctx.reply(`👋 ${ctx.session.last_name} ${ctx.session.first_name} to'rayevning rasmiy kanaliga xush kelibsiz!
📱 BOTning qo'shimcha imkoniyatlaridan foydalanish uchun telefon raqamingizni yuboring!`, {
            reply_markup: new grammy_1.Keyboard()
                .requestContact('📱 Raqamni yuborish')
                .resized()
                .oneTime(),
        });
    }
    sendEmailRequest(ctx, type = 1) {
        if (type == 1) {
            ctx.reply(`📧 Iltimos email manzilingizni kiriting!`, {
                reply_markup: new grammy_1.Keyboard().text('⏭ O\'tkazish').resized().oneTime(),
            });
        }
        else {
            ctx.reply(`📧 Iltimos Email yuboring`, {
                reply_markup: new grammy_1.Keyboard().text('⏭ O\'tkazish').resized().oneTime(),
            });
        }
    }
    async sendSubscriptionPaymentInfo(ctx, sessions) {
        const { subscriptionType } = sessions;
        const keyboard = new grammy_1.InlineKeyboard()
            .url('💳 Visa/Mastercard', sessions.octobank.octo_pay_url)
            .row()
            .url('💳 ATMOS', `${config_1.env.FRONTEND_URL}atmos/card?transaction_id=` +
            sessions.atmos.transactionId)
            .row()
            .text('⬅️ Orqaga', 'subscribe_menu');
        await ctx.deleteMessage();
        await ctx.reply(`💫 ${subscriptionType.title} - ${subscriptionType.price}:
${subscriptionType.description}`, { parse_mode: 'Markdown', reply_markup: keyboard });
    }
};
exports.TelegramSenderService = TelegramSenderService;
exports.TelegramSenderService = TelegramSenderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectBot)()),
    __metadata("design:paramtypes", [grammy_1.Bot,
        prisma_service_1.PrismaService,
        message_service_1.MessageService,
        user_service_1.UserService,
        settings_service_1.SettingsService,
        telegram_button_service_1.TelegramButtonService,
        subscription_type_service_1.SubscriptionTypeService])
], TelegramSenderService);
//# sourceMappingURL=telegram.sender.service.js.map