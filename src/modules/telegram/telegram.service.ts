import { InjectBot } from '@grammyjs/nestjs';
import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Message, MessageUser, User } from '@prisma/client';
import { isEmail } from 'class-validator';
import { Bot, InlineKeyboard, Keyboard } from 'grammy';
import { env } from 'src/common/config';
import { MessageService } from '../message/message.service';
import { PrismaService } from '../prisma/prisma.service';
import { SettingsService } from '../settings/settings.service';
import { StripeService } from '../stripe/stripe.service';
import { SubscriptionTypeService } from '../subscription-type/subscription-type.service';
import { UserService } from '../user/user.service';
import { Context } from './Context.type';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly MS_PER_DAY = 1000 * 60 * 60 * 24;
  private readonly DEFAULT_KEYBOARD = new Keyboard()
    .text("📝 Obuna Bo'lish")
    .row()
    .text('⚙️ Sozlamalar')
    .text('📋 Obunalarim')
    .row()
    .text('ℹ️ Biz haqimizda')
    .text("👨‍🏫 Kozimxon To'ayev haqida")
    .resized()
    .oneTime()
    .build();

  constructor(
    @InjectBot() readonly bot: Bot<Context>,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly subscriptionTypeService: SubscriptionTypeService,
    @Inject(forwardRef(() => StripeService))
    private readonly stripeService: StripeService,
    private readonly settingsService: SettingsService,
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
  ) {}

  onModuleInit() {}

  private calculateDaysLeft(expiredDate: Date): number {
    return Math.ceil((expiredDate.getTime() - Date.now()) / this.MS_PER_DAY);
  }

  async onReactionCallBack(ctx: Context) {
    const messageId = ctx.match[1];
    await this.messageService.update(+messageId, { status: 'READ' });
    ctx.answerCallbackQuery('✅ Reaksiya bildirildi');
  }

  public async sendMessage(
    message: MessageUser & { user: User; message: Message },
  ) {
    try {
      await this.bot.api.sendMessage(
        message.user.telegramId,
        message.message.text,
        {
          reply_markup: new InlineKeyboard().text(
            'Reaksiya Bildirish',
            `reaction_${message.id}`,
          ),
          parse_mode: 'MarkdownV2',
        },
      );

      await this.messageService.update(message.id, { status: 'DELIVERED' });
    } catch {
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

  private async handleSubscriptionPayment(
    ctx: Context,
    subscriptionTypeId: number,
  ) {
    const subscriptionType =
      await this.subscriptionTypeService.findOne(subscriptionTypeId);
    if (!subscriptionType) {
      ctx.reply('❌ Subscription type not found');
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
      ctx.reply("⚠️ Siz allaqachon ushbu obunaga a'zo bo'lgansiz");
      return;
    }

    const user = await this.userService.findOneByTelegramID(
      ctx.from.id.toString(),
    );
    const stripe = await this.stripeService.createCheckoutSession({
      subscriptionTypeId,
      userId: user.id,
    });

    return { subscriptionType, stripe };
  }

  @Interval(10000)
  async onCron() {
    await this.kickExpired();
    await this.sendAlertMessage();
    await this.sendMessages();
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
      const user = (
        await this.userService.findAll({
          phoneNumber: ctx.session.phone,
        })
      ).data[0];

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

  private async handleEmail(ctx: Context) {
    if (!ctx.session.email) {
      console.log(ctx.message.text, isEmail(ctx.message.text));
      if (ctx.message.text === "⏭ O'tkazish") {
        ctx.session.email = 'skipped';
      } else if (!isEmail(ctx.message.text)) {
        this.sendEmailRequest(ctx, 2);
        return true;
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

  private async handleSubscription(ctx: Context) {
    if (ctx.message.text == "📝 Obuna Bo'lish") {
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

      if (subscriptionTypes.data.length == 0) {
        ctx.reply("❌ Obunalar mavjud emas iltimos keyinroq urunib ko'ring");
        return true;
      }
      ctx.reply("🔥 Obuna Bo'lish", { reply_markup: keyboard });
      return true;
    }
    return false;
  }

  async sendMessages() {
    const messages = await this.prismaService.messageUser.findMany({
      where: { status: 'PENDING' },
      take: 20,
      include: {
        user: true,
        message: true,
      },
    });

    for (const message of messages) {
      await this.sendMessage(message);
    }
  }

  private async handleSettings(ctx: Context) {
    if (ctx.message.text == '⚙️ Sozlamalar') {
      const keyboard = new InlineKeyboard();
      keyboard.text("👤 Ismni o'zgartitirish", 'edit_firstname').row();
      keyboard.text("👥 Familyani o'zgartitirish", 'edit_lastname').row();
      keyboard.text("📧 Emailni o'zgartitirish", 'edit_email').row();

      const user = await this.userService.findOneByTelegramID(
        ctx.from.id.toString(),
      );
      await ctx.reply(
        `⚙️ Sozlamalar\n\n` +
          `👤 Ism: ${user.firstName}\n` +
          `👥 Familya: ${user.lastName}\n` +
          `📧 Email: ${user.email || 'Kiritilmagan'}\n` +
          `📱 Telefon: ${user.phoneNumber}`,
        { reply_markup: keyboard },
      );
      return true;
    }
    return false;
  }

  async onMessage(ctx: Context) {
    if (ctx.chat.type != 'private') return;
    if (!ctx.session.id && (await this.handleExistingUser(ctx))) return;
    if (ctx.session.id)
      this.userService.update(ctx.session.id, { lastActiveAt: new Date() });
    if (
      ctx.message.text?.startsWith('/start') &&
      (await this.handleStartCommand(ctx))
    )
      return;

    if (await this.handleEdit(ctx)) return;
    if (await this.handleUserRegistration(ctx)) return;
    if (await this.handlePhoneNumber(ctx)) return;
    if (await this.handleEmail(ctx)) return;
    if (await this.handleSubscription(ctx)) return;
    if (await this.handleSettings(ctx)) return;
    if (await this.handleMySubscriptions(ctx)) return;
    if (await this.handleInfo(ctx)) return;
  }

  async handleInfo(ctx: Context) {
    const settings = await this.settingsService.findOne();
    if (ctx.message.text == 'ℹ️ Biz haqimizda') {
      await ctx.reply(settings.aboutAminGroup);
      return true;
    }
    if (ctx.message.text == "👨‍🏫 Kozimxon To'ayev haqida") {
      await ctx.reply(settings.aboutKozimxonTorayev);
      return true;
    }
    return false;
  }

  async handleMySubscriptions(ctx: Context) {
    if (ctx.message.text == '📋 Obunalarim') {
      const subscription = await this.userService.getSubscription(ctx.from.id);
      if (!subscription) {
        await ctx.reply('❌ Sizda hozircha faol obuna mavjud emas');
        return true;
      }

      const daysLeft = this.calculateDaysLeft(subscription.expiredDate);
      const subscriptionType = await this.subscriptionTypeService.findOne(
        subscription.subscriptionTypeId,
      );

      await ctx.reply(
        `📌 Obuna turi: ${subscriptionType.title}\n` +
          `💰 Narxi: ${subscriptionType.price} so'm\n` +
          `📅 Tugash sanasi: ${subscription.expiredDate.toLocaleDateString()}\n` +
          `⏳ Qolgan kunlar: ${daysLeft} kun`,
      );
      return true;
    }
    return false;
  }

  async handleEdit(ctx: Context) {
    if (ctx.session.edit == 'firstname') {
      await this.userService.update(ctx.session.id, {
        firstName: ctx.message.text,
      });
      delete ctx.session.edit;
      await ctx.reply("✅ Ism o'zgartirildi", {
        reply_markup: { keyboard: this.DEFAULT_KEYBOARD },
      });
      return true;
    }
    if (ctx.session.edit == 'lastname') {
      await this.userService.update(ctx.session.id, {
        lastName: ctx.message.text,
      });
      delete ctx.session.edit;
      await ctx.reply("✅ Familya o'zgartirildi", {
        reply_markup: { keyboard: this.DEFAULT_KEYBOARD },
      });
      return true;
    }
    if (ctx.session.edit == 'email') {
      await this.userService.update(ctx.session.id, {
        email: ctx.message.text,
      });
      delete ctx.session.edit;
      await ctx.reply("✅ Email o'zgartirildi", {
        reply_markup: { keyboard: this.DEFAULT_KEYBOARD },
      });
      return true;
    }
    return false;
  }

  async onSubscribeCallBack(ctx: Context) {
    const subscriptionTypeId = +ctx.match[1];
    const result = await this.handleSubscriptionPayment(
      ctx,
      subscriptionTypeId,
    );

    if (!result) return;

    const { subscriptionType, stripe } = result;
    await this.sendSubscriptionPaymentInfo(ctx, subscriptionType, stripe);
  }

  async onEditCallBack(ctx: Context) {
    const editName = ctx.match[1];
    ctx.session.edit = editName;
    if (editName == 'firstname') {
      await ctx.reply('👤 Yangi ismni kiriting');
    } else if (editName == 'lastname') {
      await ctx.reply('👥 Yangi familyani kiriting');
    } else if (editName == 'email') {
      await ctx.reply('📧 Yangi emailni kiriting');
    }
  }

  private async sendSubscriptionPaymentInfo(
    ctx: Context,
    subscriptionType: any,
    stripe: any,
  ) {
    ctx.reply(
      `💫 ${subscriptionType.title} - ${subscriptionType.price}:\n${subscriptionType.description}`,
      {
        parse_mode: 'Markdown',
        reply_markup: new InlineKeyboard().url(
          '💳 Visa/Mastercard',
          stripe.url,
        ),
      },
    );
  }

  async sendAlertMessage() {
    const users = await this.prismaService.user.findMany({
      where: {
        inGroup: true,
        status: 'SUBSCRIBE',
        subscription: {
          some: {
            expiredDate: {
              gt: new Date(Date.now() - this.MS_PER_DAY * 3),
            },
          },
        },
      },
      include: {
        subscription: true,
      },
    });

    for (const user of users) {
      const sub = await this.userService.getSubscription(+user.telegramId);
      if (!sub) continue;

      const daysLeft = this.calculateDaysLeft(sub.expiredDate);

      if (daysLeft > 0 && daysLeft <= 3 && sub.alertCount <= 3 - daysLeft) {
        await this.bot.api.sendMessage(
          +user.telegramId,
          `⚠️ Ogohlantirish!\nSizning obunangiz ${sub.expiredDate.toDateString()} da tugaydi.\n⏳ ${daysLeft} kun qoldi.`,
        );

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
        subscription: {
          every: {
            expiredDate: {
              lte: new Date(),
            },
          },
        },
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

  sendStartMessage(ctx: Context, type: number = 1) {
    if (type == 1) {
      ctx.reply(`👋 Salom! Botga xush kelibsiz!`, {
        reply_markup: {
          keyboard: this.DEFAULT_KEYBOARD,
        },
      });
    }

    if (type == 2) {
      ctx.reply(
        `👋 ${ctx.session.last_name} ${ctx.session.first_name} sizni yana ko'rganimdan xursandman!`,
        {
          reply_markup: {
            keyboard: this.DEFAULT_KEYBOARD,
          },
        },
      );
    }
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
      `👋 ${ctx.session.last_name} ${ctx.session.first_name} to'rayevning rasmiy kanaliga xush kelibsiz!\n📱 BOTning qo'shimcha imkoniyatlaridan foydalanish uchun telefon raqamingizni yuboring!`,
      {
        reply_markup: {
          keyboard: new Keyboard()
            .requestContact('📱 Raqamni yuborish')
            .resized()
            .oneTime()
            .build(),
        },
      },
    );
  }

  sendEmailRequest(ctx: Context, type = 1) {
    if (type == 1) {
      ctx.reply(
        `🎉 ${ctx.session.last_name} ${ctx.session.first_name} sizga qo'shimcha imkoniyatlar ochildi.\n📧 Siz uchun maxsus takliflarni elektron pochtangizga yuborishimiz uchun iltimos email manzilingizni kiriting!`,
        {
          reply_markup: {
            keyboard: new Keyboard().text("⏭ O'tkazish").resized().build(),
          },
        },
      );
    } else {
      ctx.reply(`📧 Iltimos Email yuboring`, {
        reply_markup: {
          keyboard: new Keyboard().text("⏭ O'tkazish").resized().build(),
        },
      });
    }
  }
}
