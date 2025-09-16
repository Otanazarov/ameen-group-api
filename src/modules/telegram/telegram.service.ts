import { InjectBot } from '@grammyjs/nestjs';
import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import {
  File,
  InlineButton,
  Message,
  MessageUser,
  Prisma,
  User,
} from '@prisma/client';
import { isEmail } from 'class-validator';
import {
  Bot,
  InlineKeyboard,
  Keyboard,
  InputFile,
  InputMediaBuilder,
} from 'grammy';
import { env } from 'src/common/config';
import { MessageService } from '../message/message.service';
import { PrismaService } from '../prisma/prisma.service';
import { SettingsService } from '../settings/settings.service';
import { SubscriptionTypeService } from '../subscription-type/subscription-type.service';
import { UserService } from '../user/user.service';
import { Context } from './Context.type';
import { join } from 'path';
import { OctoBankService } from '../octobank/octobank.service';
import { AtmosService } from '../atmos/atmos.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private cronRunning = false;
  private readonly MS_PER_DAY = 1000 * 60 * 60 * 24;
  private DEFAULT_KEYBOARD: InlineKeyboard;

  constructor(
    @InjectBot() readonly bot: Bot<Context>,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly subscriptionTypeService: SubscriptionTypeService,
    private readonly settingsService: SettingsService,
    @Inject(forwardRef(() => OctoBankService))
    private readonly octobankService: OctoBankService,
    @Inject(forwardRef(() => AtmosService))
    private readonly atmosService: AtmosService,
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
  ) {}

  async onModuleInit() {
    await this.setDefaultKeyboard();
  }

  private async setDefaultKeyboard() {
    const defaultButtons = await this.prismaService.inlineButton.findMany({
      where: { default: true },
      orderBy: { id: 'asc' },
    });
    const keyboard = new InlineKeyboard();
  
    defaultButtons.forEach((button, index) => {
      keyboard.text(button.text, button.data);
      if (index % 2 !== 0) {
        keyboard.row();
      }
    });
    this.DEFAULT_KEYBOARD = keyboard;
  }

  private calculateDaysLeft(expiredDate: Date): number {
    return Math.ceil((expiredDate.getTime() - Date.now()) / this.MS_PER_DAY);
  }

  async onReactionCallBack(ctx: Context) {
    const messageId = ctx.match[1];
    await this.messageService.update(+messageId, { status: 'READ' });
    ctx.answerCallbackQuery('✅ Reaksiya bildirildi');
  }

  async onSubscribeCallBack(ctx: Context) {
    const subscriptionTypeId = +ctx.match[1];
    const result = await this.handleSubscriptionPayment(
      ctx,
      subscriptionTypeId,
    );
    if (!result) return;
    await this.sendSubscriptionPaymentInfo(ctx, result as any);
  }

  async onEditCallBack(ctx: Context) {
    const editName = ctx.match[1];
    ctx.session.edit = editName;
    const backKeyboard = new InlineKeyboard().text('⬅️ Orqaga', 'settings');
    let text = '';
    if (editName == 'firstname') {
      text = '👤 Yangi ismni kiriting';
    } else if (editName == 'lastname') {
      text = '👥 Yangi familyani kiriting';
    } else if (editName == 'email') {
      text = '📧 Yangi emailni kiriting';
    }
    const message = await ctx.editMessageText(text, {
      reply_markup: backKeyboard,
    });
    if (typeof message === 'object') {
      ctx.session.message_id = message.message_id;
    }
  }

  async onSettingsCallBack(ctx: Context) {
    delete ctx.session.edit;
    await this.sendSettingsMessage(ctx);
  }

  async onSubscriptionMenuCallBack(ctx: Context) {
    await this.sendSubscriptionMenu(ctx);
  }

  async onStartMessageCallBack(ctx: Context) {
    const text =( await this.settingsService.findOne()).startMessage;
    await this.setDefaultKeyboard();
    try {
      await ctx.editMessageText(text, { reply_markup: this.DEFAULT_KEYBOARD });
    } catch (e) {
      await ctx.deleteMessage();
      await ctx.reply(text, { reply_markup: this.DEFAULT_KEYBOARD });
    }
  }

  async onCancelSubscriptionCallBack(ctx: Context) {
    const subscription = await this.userService.getSubscription(ctx.from.id);
    if (!subscription) {
      await ctx.answerCallbackQuery({
        text: '❌ Sizda hozircha faol obuna mavjud emas',
        show_alert: true,
      });
      return;
    }
    try {
      const user = await this.userService.cancelSubscription(
        ctx.from.id.toString(),
      );
      try {
        await ctx.api.banChatMember(env.TELEGRAM_GROUP_ID, ctx.from.id);
      } catch {}
      await this.userService.update(user.id, { inGroup: false });
      await ctx.answerCallbackQuery({ text: 'Obuna bekor qilindi' });
      await this.onStartMessageCallBack(ctx);
    } catch (e) {
      console.log(e);
      await ctx.answerCallbackQuery({
        text: 'Obuna bekor qilishda muomoga chiqdi',
      });
    }
  }

  async onUncancelSubscriptionCallBack(ctx: Context) {
    const subscription = await this.userService.getSubscription(
      ctx.from.id,
      false,
    );
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
      const link = await ctx.api.createChatInviteLink(env.TELEGRAM_GROUP_ID, {
        name: ctx.from.first_name,
        creates_join_request: true,
      });
      await ctx.reply(
        "🎉 Guruhga qo'shilish uchun havola: " + link.invite_link,
      );
      await this.onStartMessageCallBack(ctx);
    } catch (e) {
      console.log(e);
      await ctx.answerCallbackQuery({
        text: 'Obuna tiklashda muomoga chiqdi',
      });
    }
  }

  async onMySubscriptionsCallBack(ctx: Context) {
    const subscription = await this.userService.getSubscription(ctx.from.id);
    const keyboard = new InlineKeyboard();
    if (!subscription) {
      const canceledSubscription = await this.userService.getSubscription(
        ctx.from.id,
        false,
      );
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
    const daysLeft = this.calculateDaysLeft(subscription.expiredDate);
    const subscriptionType = await this.subscriptionTypeService.findOne(
      subscription.subscriptionTypeId,
    );
    const text =
      `📌 Obuna turi: ${subscriptionType.title}
` +
      `💰 Narxi: ${subscriptionType.price} so'm
` +
      `📅 Tugash sanasi: ${subscription.expiredDate.toLocaleDateString()}
` +
      `⏳ Qolgan kunlar: ${daysLeft} kun`;
    await ctx.editMessageText(text, { reply_markup: keyboard });
  }

  async onAboutUsCallBack(ctx: Context) {
    const settings = await this.settingsService.findOne();
    const keyboard = new InlineKeyboard().text('⬅️ Orqaga', 'start_message');
    if (settings.aboutAminGroupImage) {
      const filePath = join(
        __dirname,
        '..',
        '..',
        '..',
        'public',
        settings.aboutAminGroupImage.url,
      );
      await ctx.editMessageMedia(
        InputMediaBuilder.photo(new InputFile(filePath)),
      );
      await ctx.editMessageCaption({
        caption: settings.aboutAminGroup,
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      });
    } else {
      await ctx.editMessageText(settings.aboutAminGroup, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      });
    }
  }

  async onAboutTeacherCallBack(ctx: Context) {
    const settings = await this.settingsService.findOne();
    const keyboard = new InlineKeyboard().text('⬅️ Orqaga', 'start_message');
    if (settings.aboutKozimxonTorayevImage) {
      const filePath = join(
        __dirname,
        '..',
        '..',
        '..',
        'public',
        settings.aboutKozimxonTorayevImage.url,
      );
      await ctx.editMessageMedia(
        InputMediaBuilder.photo(new InputFile(filePath)),
      );
      await ctx.editMessageCaption({
        caption: settings.aboutKozimxonTorayev,
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      });
    } else {
      await ctx.editMessageText(settings.aboutKozimxonTorayev, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      });
    }
  }

  public async sendMessage(
    message: MessageUser & {
      user: User;
      message: Message & {
        files: File[];
        buttonPlacement: Prisma.InlineButtonPlacementGetPayload<{
          include: { button: true };
        }>[];
      };
    },
  ) {
    try {
      // eslint-disable-next-line prefer-const
      let { text, buttonPlacement, files } = message.message;

      const replyMarkup: InlineKeyboard = new InlineKeyboard();
      if (buttonPlacement.length > 0) {
        const rows = {};
        buttonPlacement.forEach((placement) => {
          if (!rows[placement.row]) {
            rows[placement.row] = [];
          }
          rows[placement.row].push(placement.button);
        });

        Object.values(rows).forEach((row: InlineButton[]) => {
          const buttons = row
            .map((button) => {
              if (button.url) {
                return InlineKeyboard.url(button.text, button.url);
              } else if (button.data) {
                return InlineKeyboard.text(button.text, button.data);
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

      const commonOptions: any = {
        caption: text,
        parse_mode: 'Markdown',
        reply_markup: replyMarkup,
      };

      await this.messageService.update(message.id, { status: 'SENDING' });

      if (files.length > 0) {
        if (files.length == 1) {
          const file = files[0];
          const filePath = join(
            __dirname,
            '..',
            '..',
            '..',
            'public',
            file.url,
          );
          const inputFile = new InputFile(filePath);
          if (file.mimetype.startsWith('image')) {
            await this.bot.api.sendPhoto(message.user.telegramId, inputFile, {
              ...commonOptions,
            });
          } else if (file.mimetype.startsWith('video')) {
            await this.bot.api.sendVideo(message.user.telegramId, inputFile, {
              ...commonOptions,
            });
          } else {
            await this.bot.api.sendDocument(
              message.user.telegramId,
              inputFile,
              {
                ...commonOptions,
              },
            );
          }
        } else {
          const inputFiles = files.map((file) => {
            const filePath = join(
              __dirname,
              '..',
              '..',
              '..',
              'public',
              file.url,
            );

            if (file.mimetype.startsWith('image')) {
              return InputMediaBuilder.photo(new InputFile(filePath), {
                ...commonOptions,
              });
            } else if (file.mimetype.startsWith('video')) {
              return InputMediaBuilder.video(new InputFile(filePath), {
                ...commonOptions,
              });
            } else {
              return InputMediaBuilder.document(new InputFile(filePath), {
                ...commonOptions,
              });
            }
          });
          inputFiles[inputFiles.length - 1];
          await this.bot.api.sendMediaGroup(
            message.user.telegramId,
            inputFiles,
          );
        }
      } else {
        await this.bot.api.sendMessage(message.user.telegramId, text, {
          reply_markup: replyMarkup,
          parse_mode: 'Markdown',
        });
      }
      await this.messageService.update(message.id, { status: 'DELIVERED' });
    } catch (e) {
      console.log(e);
      await this.messageService.update(message.id, { status: 'NOTSENT' });
    }
  }
  private async updateUserSession(ctx: Context, user: any) {
    ctx.session.id = user.id;
    ctx.session.phone = user.phoneNumber;
    ctx.session.first_name = user.firstName;
    ctx.session.last_name = user.lastName;
    ctx.session.email = user.email || 'skipped';
  }

  async handleSubscriptionPayment(ctx: Context, subscriptionTypeId: number) {
    const subscriptionType =
      await this.subscriptionTypeService.findOne(subscriptionTypeId);
    if (!subscriptionType) {
      await ctx.answerCallbackQuery('❌ Subscription type not found');
      await ctx.deleteMessage();
      return;
    }
    const subscription = await this.userService.getSubscription(ctx.from.id);
    const daysLeft = subscription
      ? this.calculateDaysLeft(subscription.expiredDate)
      : 0;
    if (
      subscription &&
      subscription.subscriptionTypeId == subscriptionTypeId &&
      daysLeft > 3
    ) {
      await ctx.answerCallbackQuery({
        text: "⚠️ Siz allaqachon ushbu obunaga a'zo bo'lgansiz",
        show_alert: true,
      });
      return;
    }
    const user = await this.userService.findOneByTelegramID(
      ctx.from.id.toString(),
    );

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
  @Interval(10000)
  async onCron() {
    if (this.cronRunning) return;
    this.cronRunning = true;
    await this.kickExpired();
    await this.sendAlertMessage();
    await this.sendMessages();
    this.cronRunning = false;
  }
  private async handleExistingUser(ctx: Context) {
    if (ctx.session.id) return false;
    const user = await this.userService.findOneByTelegramID(
      ctx.from.id.toString(),
    );
    if (user) {
      await this.updateUserSession(ctx, user);
      return false;
    }
    return false;
  }
  private async handleStartCommand(ctx: Context) {
    const user = await this.userService.findOneByTelegramID(
      ctx.from.id.toString(),
    );
    if (!user) {
      ctx.session = {};
      this.sendNameRequest(ctx, 1);
      return true;
    }
    const subscription = await this.userService.getSubscription(
      +user.telegramId,
    );
    if (subscription && !user.inGroup) {
      const link = await ctx.api.createChatInviteLink(env.TELEGRAM_GROUP_ID, {
        name: ctx.from.first_name,
        creates_join_request: true,
      });
      await ctx.reply(
        "🎉 Guruhga qo'shilish uchun havola: " + link.invite_link,
      );
      return true;
    }
    this.sendStartMessage(ctx);
    return true;
  }
  private async handleUserRegistration(ctx: Context) {
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
  private async handlePhoneNumber(ctx: Context) {
    if (!ctx.session.phone) {
      if (!ctx.message.contact) {
        this.sendPhoneRequest(ctx);
        return true;
      }
      ctx.session.phone = ctx.message.contact.phone_number;
      let user: any = (
        await this.userService.findAll({ phoneNumber: ctx.session.phone })
      ).data[0];
      if (user) {
        ctx.session.email = user.email || 'skipped';
      } else {
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

      this.sendStartMessage(ctx);
      return true;
    }
    return false;
  }
  private async sendSubscriptionMenu(ctx: Context) {
    const subscriptionTypes = await this.subscriptionTypeService.findAll({
      limit: 100,
    });
    const keyboard = new InlineKeyboard();
    subscriptionTypes.data.forEach((subscriptionType) => {
      keyboard
        .text(
          `💫 ${subscriptionType.title} - ${subscriptionType.price} so'm / ${subscriptionType.expireDays} kun`,
          `subscribe-${subscriptionType.id}`,
        )
        .row();
    });
    keyboard.text('⬅️ Orqaga', 'start_message').row();
    const text = "🔥 Obuna Bo'lish";
    if (subscriptionTypes.data.length == 0) {
      if (ctx.callbackQuery) {
        await ctx.editMessageText(
          "❌ Obunalar mavjud emas iltimos keyinroq urunib ko'ring",
          { reply_markup: keyboard },
        );
      } else {
        await ctx.reply(
          "❌ Obunalar mavjud emas iltimos keyinroq urunib ko'ring",
          { reply_markup: keyboard },
        );
      }
      return;
    }
    if (ctx.callbackQuery) {
      await ctx.editMessageText(text, { reply_markup: keyboard });
    } else {
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
      await this.sendMessage(message as any);
    }
  }
  private async sendSettingsMessage(ctx: Context, messageId?: number) {
    const keyboard = new InlineKeyboard()
      .text("👤 Ismni o'zgartitirish", 'edit_firstname')
      .row()
      .text("👥 Familyani o'zgartitirish", 'edit_lastname')
      .row()
      .text("📧 Emailni o'zgartitirish", 'edit_email')
      .row()
      .text('⬅️ Orqaga', 'start_message');
    const user = await this.userService.findOneByTelegramID(
      ctx.from.id.toString(),
    );
    const text =
      `⚙️ Sozlamalar

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
    } else if (ctx.callbackQuery) {
      await ctx.editMessageText(text, { reply_markup: keyboard });
    } else {
      await ctx.reply(text, { reply_markup: keyboard });
    }
  }
  async onMessage(ctx: Context) {
    if (ctx.chat.type != 'private') return;
    if (!ctx.session.id && (await this.handleExistingUser(ctx))) return;
    if (
      ctx.message.text?.startsWith('/start') &&
      (await this.handleStartCommand(ctx))
    )
      return;
    if (await this.handleEdit(ctx)) return;
    if (await this.handleUserRegistration(ctx)) return;
    if (await this.handlePhoneNumber(ctx)) return;
  }
  async handleEdit(ctx: Context) {
    if (ctx.session.edit) {
      const editType = ctx.session.edit;
      const value = ctx.message.text;
      if (editType === 'firstname') {
        await this.userService.update(ctx.session.id, { firstName: value });
      } else if (editType === 'lastname') {
        await this.userService.update(ctx.session.id, { lastName: value });
      } else if (editType === 'email') {
        if (!isEmail(value)) {
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
      } else {
        await this.sendSettingsMessage(ctx);
      }
      return true;
    }
    return false;
  }
  private async sendSubscriptionPaymentInfo(
    ctx: Context,
    sessions: Awaited<ReturnType<this['handleSubscriptionPayment']>>,
  ) {
    const { subscriptionType } = sessions;
    const keyboard = new InlineKeyboard()
      .url('💳 Visa/Mastercard', sessions.octobank.octo_pay_url)
      .row()
      .url(
        '💳 ATMOS',
        `${env.FRONTEND_URL}atmos/card?transaction_id=` +
          sessions.atmos.transactionId,
      )
      .row()
      .text('⬅️ Orqaga', 'subscribe_menu');
    await ctx.deleteMessage();
    await ctx.reply(
      `💫 ${subscriptionType.title} - ${subscriptionType.price}:
${subscriptionType.description}`,
      { parse_mode: 'Markdown', reply_markup: keyboard },
    );
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
      if (!sub) continue;
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
      this.bot.api.banChatMember(env.TELEGRAM_GROUP_ID, +user.telegramId);
      this.bot.api.unbanChatMember(env.TELEGRAM_GROUP_ID, +user.telegramId);
    }
  }
  async sendStartMessage(ctx: Context) {
    await this.setDefaultKeyboard();

    const text =( await this.settingsService.findOne()).startMessage;
    ctx.reply(text, {
      reply_markup: { ...this.DEFAULT_KEYBOARD, remove_keyboard: true },
    });
  }

  sendNameRequest(ctx: Context, step: number) {
    if (step == 1) {
      ctx.reply(`👤 Iltimos, ismingizni yuboring.`);
    }
    if (step == 2) {
      ctx.reply(`👥 Iltimos, familiyangizni yuboring.`);
    }
  }
  sendPhoneRequest(ctx: Context) {
    ctx.reply(
      `👋 ${ctx.session.last_name} ${ctx.session.first_name} to'rayevning rasmiy kanaliga xush kelibsiz!
📱 BOTning qo'shimcha imkoniyatlaridan foydalanish uchun telefon raqamingizni yuboring!`,
      {
        reply_markup: new Keyboard()
          .requestContact('📱 Raqamni yuborish')
          .resized()
          .oneTime(),
      },
    );
  }
  sendEmailRequest(ctx: Context, type = 1) {
    if (type == 1) {
      ctx.reply(
        `🎉 ${ctx.session.last_name} ${ctx.session.first_name} sizga qo'shimcha imkoniyatlar ochildi.
📧 Siz uchun maxsus takliflarni elektron pochtangizga yuborishimiz uchun iltimos email manzilingizni kiriting!`,
        {
          reply_markup: new Keyboard().text("⏭ O'tkazish").resized().oneTime(),
        },
      );
    } else {
      ctx.reply(`📧 Iltimos Email yuboring`, {
        reply_markup: new Keyboard().text("⏭ O'tkazish").resized().oneTime(),
      });
    }
  }
}
