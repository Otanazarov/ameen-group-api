import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Bot, InlineKeyboard, Keyboard } from 'grammy';
import { InjectBot } from '@grammyjs/nestjs';
import { Context } from './Context.type';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { env } from 'src/common/config';
import { Cron, Interval } from '@nestjs/schedule';
import { isEmail } from 'class-validator';
import { SubscriptionTypeService } from '../subscription-type/subscription-type.service';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class TelegramService {
  private readonly MS_PER_DAY = 1000 * 60 * 60 * 24;
  private readonly DEFAULT_KEYBOARD = new Keyboard()
    .text("Obuna Bo'lish")
    .text('Sozlamalar')
    .text('Obunalarim')
    .text('Biz haqimizda')
    .text("Kozimxon To'ayev haqida")
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
  ) {}

  private calculateDaysLeft(expiredDate: Date): number {
    return Math.ceil((expiredDate.getTime() - Date.now()) / this.MS_PER_DAY);
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
      ctx.reply('Subscription type not found');
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
      ctx.reply("siz allaqachon ushbu obunaga a'zo bo'lgansiz");
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

  @Interval(1000)
  async onCron() {
    await this.kickExpired();
    await this.sendAlertMessage();
  }

  private async handleExistingUser(ctx: Context) {
    const user = await this.userService.findOneByTelegramID(
      ctx.from.id.toString(),
    );
    if (user) {
      await this.updateUserSession(ctx, user);
      this.sendStartMessage(ctx);
      return true;
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
    if (subscription?.status == 'Paid' && !user.inGroup) {
      const link = await ctx.api.createChatInviteLink(env.TELEGRAM_GROUP_ID, {
        member_limit: 1,
        name: ctx.from.first_name,
      });
      ctx.reply(link.invite_link);
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
      if (!isEmail(ctx.message.text)) {
        if (ctx.message.text === "O'tkazish") {
          ctx.session.email = 'skipped';
        } else {
          this.sendEmailRequest(ctx);
        }
        const user = await this.userService.create({
          firstName: ctx.session.first_name,
          lastName: ctx.session.last_name,
          phoneNumber: ctx.session.phone,
          email: ctx.session.email === 'skipped' ? null : ctx.session.email,
          telegramId: ctx.from.id.toString(),
        });
        ctx.session.id = user.id;
        this.sendStartMessage(ctx);
        return true;
      }
      ctx.session.email = ctx.message.text;
      return true;
    }
    return false;
  }

  private async handleSubscription(ctx: Context) {
    if (ctx.message.text == "Obuna Bo'lish") {
      const subscriptionTypes = await this.subscriptionTypeService.findAll({
        limit: 100,
      });

      const keyboard = new InlineKeyboard();
      subscriptionTypes.data.forEach((subscriptionType) => {
        keyboard
          .text(
            `${subscriptionType.title} - ${subscriptionType.price} so'm`,
            `subscribe-${subscriptionType.id}`,
          )
          .row();
      });

      ctx.reply("Obuna Bo'lish", { reply_markup: keyboard });
      return true;
    }
    return false;
  }

  private async handleSettings(ctx: Context) {
    if (ctx.message.text == 'Sozlamalar') {
      const keyboard = new InlineKeyboard();
      keyboard.text("Ismni o'zgartitirish", 'edit_firstname').row();
      keyboard.text("Familyani o'zgartitirish", 'edit_lastname').row();
      keyboard.text("Emailni o'zgartitirish", 'edit_email').row();

      ctx.reply('Sozlamalar', { reply_markup: keyboard });
      return true;
    }
    return false;
  }

  async onMessage(ctx: Context) {
    if (ctx.chat.type != 'private') return;
    console.log(ctx.session, 'session');
    if (!ctx.session.id && (await this.handleExistingUser(ctx))) return;
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
  }

  async handleEdit(ctx: Context) {
    if (ctx.session.edit == 'firstname') {
      await this.userService.update(ctx.session.id, {
        firsName: ctx.message.text,
      });
      delete ctx.session.edit;
      await ctx.reply("Ism o'zgartirildi", {
        reply_markup: { keyboard: this.DEFAULT_KEYBOARD },
      });
      return true;
    }
    if (ctx.session.edit == 'lastname') {
      await this.userService.update(ctx.session.id, {
        lastName: ctx.message.text,
      });
      delete ctx.session.edit;
      await ctx.reply("Familya o'zgartirildi", {
        reply_markup: { keyboard: this.DEFAULT_KEYBOARD },
      });
      return true;
    }
    if (ctx.session.edit == 'email') {
      await this.userService.update(ctx.session.id, {
        email: ctx.message.text,
      });
      delete ctx.session.edit;
      await ctx.reply("Email o'zgartirildi", {
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
    console.log(ctx.session, 'edit callback');
    if (editName == 'firstname') {
      console.log(editName);
      await ctx.reply('Ismni kiriting');
    } else if (editName == 'lastname') {
      await ctx.reply('Familyani kiriting');
    } else if (editName == 'email') {
      await ctx.reply('Emailni kiriting');
    }
  }

  private async sendSubscriptionPaymentInfo(
    ctx: Context,
    subscriptionType: any,
    stripe: any,
  ) {
    ctx.reply(
      `${subscriptionType.title} - ${subscriptionType.price}:\n${subscriptionType.description}\nTo'lov qilish: \n[Visa/Mastercard](${stripe.url})`,
      { parse_mode: 'Markdown' },
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
          `Sizning obunangiz ${sub.expiredDate.toDateString()} da tugaydi. ${daysLeft} kun qoldi.`,
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
      ctx.reply(`Salom Botga hush kelibsiz!`, {
        reply_markup: {
          keyboard: this.DEFAULT_KEYBOARD,
        },
      });
    }

    if (type == 2) {
      ctx.reply(
        `${ctx.session.last_name} ${ctx.session.first_name} sizni yana ko'rganimdan xursandman!`,
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
      ctx.reply(`Ismingizni yuboring.`);
    }
    if (step == 2) {
      ctx.reply(`Familiyangizni yuboring.`);
    }
  }

  sendPhoneRequest(ctx: Context) {
    ctx.reply(
      `${ctx.from.last_name} ${ctx.from.first_name} to'rayevning rasmiy kanaliga xush kelibsiz! BOTning qo'shimcha imkoniyatlaridan foydalanish uchun telefon raqamingizni yuboring!`,
      {
        reply_markup: {
          keyboard: new Keyboard()
            .requestContact('Raqamni yuborish')
            .resized()
            .oneTime()
            .build(),
        },
      },
    );
  }

  sendEmailRequest(ctx: Context) {
    ctx.reply(
      `${ctx.from.last_name} ${ctx.from.first_name} sizga qo'shimcha imkoniyatlar ochildi. \nSiz uchun mahsus takliflarni elektron pochtangizga yuborishimiz uchun iltimos email manzilingizni kiriting!`,
      {
        reply_markup: {
          keyboard: new Keyboard().text("O'tkazish").resized().build(),
        },
      },
    );
  }
}
