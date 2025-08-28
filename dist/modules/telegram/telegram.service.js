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
const schedule_1 = require("@nestjs/schedule");
const class_validator_1 = require("class-validator");
const grammy_1 = require("grammy");
const config_1 = require("../../common/config");
const message_service_1 = require("../message/message.service");
const prisma_service_1 = require("../prisma/prisma.service");
const settings_service_1 = require("../settings/settings.service");
const subscription_type_service_1 = require("../subscription-type/subscription-type.service");
const user_service_1 = require("../user/user.service");
const path_1 = require("path");
const octobank_service_1 = require("../octobank/octobank.service");
const buttons_service_1 = require("../buttons/buttons.service");
const atmos_service_1 = require("../atmos/atmos.service");
let TelegramService = class TelegramService {
    constructor(bot, userService, prismaService, subscriptionTypeService, settingsService, buttonsService, octobankService, atmosService, messageService) {
        this.bot = bot;
        this.userService = userService;
        this.prismaService = prismaService;
        this.subscriptionTypeService = subscriptionTypeService;
        this.settingsService = settingsService;
        this.buttonsService = buttonsService;
        this.octobankService = octobankService;
        this.atmosService = atmosService;
        this.messageService = messageService;
        this.cronRunning = false;
        this.MS_PER_DAY = 1000 * 60 * 60 * 24;
    }
    async onModuleInit() {
        await this.setDefaultKeyboard();
    }
    async setDefaultKeyboard() {
        const defaultButtons = await this.prismaService.inlineButton.findMany({
            where: { default: true },
            orderBy: { id: 'asc' },
        });
        const keyboard = new grammy_1.InlineKeyboard();
        defaultButtons.forEach((button, index) => {
            keyboard.text(button.text, button.data);
            if (index % 2 !== 0) {
                keyboard.row();
            }
        });
        this.DEFAULT_KEYBOARD = keyboard;
    }
    calculateDaysLeft(expiredDate) {
        return Math.ceil((expiredDate.getTime() - Date.now()) / this.MS_PER_DAY);
    }
    async onReactionCallBack(ctx) {
        const messageId = ctx.match[1];
        await this.messageService.update(+messageId, { status: 'READ' });
        ctx.answerCallbackQuery('✅ Reaksiya bildirildi');
    }
    async onSubscribeCallBack(ctx) {
        const subscriptionTypeId = +ctx.match[1];
        const result = await this.handleSubscriptionPayment(ctx, subscriptionTypeId);
        if (!result)
            return;
        await this.sendSubscriptionPaymentInfo(ctx, result);
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
        await this.sendSettingsMessage(ctx);
    }
    async onSubscriptionMenuCallBack(ctx) {
        await this.sendSubscriptionMenu(ctx);
    }
    async onStartMessageCallBack(ctx) {
        const text = `👋 Salom! Botga xush kelibsiz!`;
        await this.setDefaultKeyboard();
        try {
            await ctx.editMessageText(text, { reply_markup: this.DEFAULT_KEYBOARD });
        }
        catch (e) {
            await ctx.deleteMessage();
            await ctx.reply(text, { reply_markup: this.DEFAULT_KEYBOARD });
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
            await ctx.api.banChatMember(config_1.env.TELEGRAM_GROUP_ID, ctx.from.id);
            await this.userService.update(user.id, { inGroup: false });
            await ctx.answerCallbackQuery({ text: "Obuna bekor qilindi" });
            await this.onStartMessageCallBack(ctx);
        }
        catch (e) {
            console.log(e);
            await ctx.answerCallbackQuery({ text: "Obuna bekor qilishda muomoga chiqdi" });
        }
    }
    async onMySubscriptionsCallBack(ctx) {
        const subscription = await this.userService.getSubscription(ctx.from.id);
        if (!subscription) {
            await ctx.answerCallbackQuery({
                text: '❌ Sizda hozircha faol obuna mavjud emas',
                show_alert: true,
            });
            return;
        }
        const daysLeft = this.calculateDaysLeft(subscription.expiredDate);
        const subscriptionType = await this.subscriptionTypeService.findOne(subscription.subscriptionTypeId);
        const keyboard = new grammy_1.InlineKeyboard()
            .text('Bekor Qilish', 'cancel_subscription')
            .row()
            .text('⬅️ Orqaga', 'start_message');
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
        if (settings.aboutAminGroupImage) {
            const filePath = (0, path_1.join)(__dirname, '..', '..', '..', 'public', settings.aboutAminGroupImage.url);
            await ctx.editMessageMedia(grammy_1.InputMediaBuilder.photo(new grammy_1.InputFile(filePath)));
            await ctx.editMessageCaption({
                caption: settings.aboutAminGroup,
                parse_mode: 'Markdown',
                reply_markup: keyboard,
            });
        }
        else {
            await ctx.editMessageText(settings.aboutAminGroup, {
                parse_mode: 'Markdown',
                reply_markup: keyboard,
            });
        }
    }
    async onAboutTeacherCallBack(ctx) {
        const settings = await this.settingsService.findOne();
        const keyboard = new grammy_1.InlineKeyboard().text('⬅️ Orqaga', 'start_message');
        if (settings.aboutKozimxonTorayevImage) {
            const filePath = (0, path_1.join)(__dirname, '..', '..', '..', 'public', settings.aboutKozimxonTorayevImage.url);
            await ctx.editMessageMedia(grammy_1.InputMediaBuilder.photo(new grammy_1.InputFile(filePath)));
            await ctx.editMessageCaption({
                caption: settings.aboutKozimxonTorayev,
                parse_mode: 'Markdown',
                reply_markup: keyboard,
            });
        }
        else {
            await ctx.editMessageText(settings.aboutKozimxonTorayev, {
                parse_mode: 'Markdown',
                reply_markup: keyboard,
            });
        }
    }
    async sendMessage(message) {
        try {
            let { text, buttonPlacement, files } = message.message;
            const replyMarkup = new grammy_1.InlineKeyboard();
            if (buttonPlacement.length > 0) {
                const rows = {};
                buttonPlacement.forEach((placement) => {
                    if (!rows[placement.row]) {
                        rows[placement.row] = [];
                    }
                    rows[placement.row].push(placement.button);
                });
                Object.values(rows).forEach((row) => {
                    const buttons = row
                        .map((button) => {
                        if (button.url) {
                            return grammy_1.InlineKeyboard.url(button.text, button.url);
                        }
                        else if (button.data) {
                            return grammy_1.InlineKeyboard.text(button.text, button.data);
                        }
                        return null;
                    })
                        .filter(Boolean);
                    if (buttons.length > 0) {
                        replyMarkup.row(...buttons);
                    }
                });
            }
            replyMarkup.row().text('Reaksiya Bildirish', `reaction_${message.id}`);
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
    async updateUserSession(ctx, user) {
        ctx.session.id = user.id;
        ctx.session.phone = user.phoneNumber;
        ctx.session.first_name = user.firstName;
        ctx.session.last_name = user.lastName;
        ctx.session.email = user.email || 'skipped';
    }
    async handleSubscriptionPayment(ctx, subscriptionTypeId) {
        const subscriptionType = await this.subscriptionTypeService.findOne(subscriptionTypeId);
        if (!subscriptionType) {
            await ctx.answerCallbackQuery('❌ Subscription type not found');
            await ctx.deleteMessage();
            return;
        }
        const subscription = await this.userService.getSubscription(ctx.from.id);
        const daysLeft = subscription
            ? this.calculateDaysLeft(subscription.expiredDate)
            : 0;
        if (subscription &&
            subscription.subscriptionTypeId == subscriptionTypeId &&
            daysLeft > 3) {
            await ctx.answerCallbackQuery({
                text: "⚠️ Siz allaqachon ushbu obunaga a'zo bo'lgansiz",
                show_alert: true,
            });
            return;
        }
        const user = await this.userService.findOneByTelegramID(ctx.from.id.toString());
        const atmos = await this.atmosService.createLink({
            subscriptionTypeId: subscriptionType.id,
            userId: user.id,
        });
        const octobank = await this.octobankService.createCheckoutSession({
            subscriptionTypeId,
            userId: user.id,
        });
        return { subscriptionType, octobank, atmos };
    }
    async onCron() {
        if (this.cronRunning)
            return;
        this.cronRunning = true;
        await this.kickExpired();
        await this.sendAlertMessage();
        await this.sendMessages();
        this.cronRunning = false;
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
    async handleStartCommand(ctx) {
        const user = await this.userService.findOneByTelegramID(ctx.from.id.toString());
        if (!user) {
            ctx.session = {};
            this.sendNameRequest(ctx, 1);
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
        this.sendStartMessage(ctx);
        return true;
    }
    async handleUserRegistration(ctx) {
        if (!ctx.session.first_name) {
            ctx.session.first_name = ctx.message.text;
            this.sendNameRequest(ctx, 2);
            return true;
        }
        if (!ctx.session.last_name) {
            ctx.session.last_name = ctx.message.text;
            this.sendPhoneRequest(ctx);
            return true;
        }
        return false;
    }
    async handlePhoneNumber(ctx) {
        if (!ctx.session.phone) {
            if (!ctx.message.contact) {
                this.sendPhoneRequest(ctx);
                return true;
            }
            ctx.session.phone = ctx.message.contact.phone_number;
            const user = (await this.userService.findAll({ phoneNumber: ctx.session.phone })).data[0];
            if (user) {
                ctx.session.id = user.id;
                ctx.session.email = user.email || 'skipped';
                this.sendStartMessage(ctx);
                return true;
            }
            this.sendEmailRequest(ctx);
            return true;
        }
        return false;
    }
    async handleEmail(ctx) {
        if (!ctx.session.email) {
            if (ctx.message.text == "⏭ O'tkazish") {
                ctx.session.email = 'skipped';
            }
            else {
                if (!(0, class_validator_1.isEmail)(ctx.message.text)) {
                    this.sendEmailRequest(ctx, 2);
                    return true;
                }
                ctx.session.email = ctx.message.text;
            }
            const user = await this.userService.create({
                firstName: ctx.session.first_name,
                lastName: ctx.session.last_name,
                phoneNumber: ctx.session.phone,
                username: ctx.from.username,
                email: ctx.session.email === 'skipped' ? null : ctx.session.email,
                telegramId: ctx.from.id.toString(),
            });
            ctx.session.id = user.id;
            this.sendStartMessage(ctx);
            return true;
        }
        return false;
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
            await ctx.api.editMessageText(ctx.chat.id, messageId, text, {
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
    async onMessage(ctx) {
        if (ctx.chat.type != 'private')
            return;
        if (!ctx.session.id && (await this.handleExistingUser(ctx)))
            return;
        if (ctx.message.text?.startsWith('/start') &&
            (await this.handleStartCommand(ctx)))
            return;
        if (await this.handleEdit(ctx))
            return;
        if (await this.handleUserRegistration(ctx))
            return;
        if (await this.handlePhoneNumber(ctx))
            return;
        if (await this.handleEmail(ctx))
            return;
    }
    async handleEdit(ctx) {
        if (ctx.session.edit) {
            const editType = ctx.session.edit;
            const value = ctx.message.text;
            if (editType === 'firstname') {
                await this.userService.update(ctx.session.id, { firstName: value });
            }
            else if (editType === 'lastname') {
                await this.userService.update(ctx.session.id, { lastName: value });
            }
            else if (editType === 'email') {
                if (!(0, class_validator_1.isEmail)(value)) {
                    await ctx.reply("📧 Iltimos, to'g'ri email manzil kiriting.");
                    return true;
                }
                await this.userService.update(ctx.session.id, { email: value });
            }
            delete ctx.session.edit;
            await ctx.deleteMessage();
            if (ctx.session.message_id) {
                await this.sendSettingsMessage(ctx, ctx.session.message_id);
                delete ctx.session.message_id;
            }
            else {
                await this.sendSettingsMessage(ctx);
            }
            return true;
        }
        return false;
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
            const daysLeft = this.calculateDaysLeft(sub.expiredDate);
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
    async sendStartMessage(ctx, type = 1) {
        await this.setDefaultKeyboard();
        const text = type === 1
            ? `👋 Salom! Botga xush kelibsiz!`
            : `👋 ${ctx.session.last_name} ${ctx.session.first_name} sizni yana ko'rganimdan xursandman!`;
        ctx.reply(text, {
            reply_markup: { ...this.DEFAULT_KEYBOARD, remove_keyboard: true },
        });
    }
    sendNameRequest(ctx, step) {
        if (step == 1) {
            ctx.reply(`👤 Iltimos, ismingizni yuboring.`);
        }
        if (step == 2) {
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
            ctx.reply(`🎉 ${ctx.session.last_name} ${ctx.session.first_name} sizga qo'shimcha imkoniyatlar ochildi.
📧 Siz uchun maxsus takliflarni elektron pochtangizga yuborishimiz uchun iltimos email manzilingizni kiriting!`, {
                reply_markup: new grammy_1.Keyboard().text("⏭ O'tkazish").resized().oneTime(),
            });
        }
        else {
            ctx.reply(`📧 Iltimos Email yuboring`, {
                reply_markup: new grammy_1.Keyboard().text("⏭ O'tkazish").resized().oneTime(),
            });
        }
    }
};
exports.TelegramService = TelegramService;
__decorate([
    (0, schedule_1.Interval)(10000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TelegramService.prototype, "onCron", null);
exports.TelegramService = TelegramService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectBot)()),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => octobank_service_1.OctoBankService))),
    __param(7, (0, common_1.Inject)((0, common_1.forwardRef)(() => atmos_service_1.AtmosService))),
    __param(8, (0, common_1.Inject)((0, common_1.forwardRef)(() => message_service_1.MessageService))),
    __metadata("design:paramtypes", [grammy_1.Bot,
        user_service_1.UserService,
        prisma_service_1.PrismaService,
        subscription_type_service_1.SubscriptionTypeService,
        settings_service_1.SettingsService,
        buttons_service_1.ButtonsService,
        octobank_service_1.OctoBankService,
        atmos_service_1.AtmosService,
        message_service_1.MessageService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map