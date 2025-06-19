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
  constructor(
    @InjectBot() readonly bot: Bot<Context>,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly subscriptionTypeService: SubscriptionTypeService,
    @Inject(forwardRef(() => StripeService))
    private readonly stripeService: StripeService,
  ) {}

  @Interval(1000)
  async onCron() {
    await this.kickExpired();
    await this.sendAlertMessage();
  }

  async onMessage(ctx: Context) {
    if (ctx.chat.type != 'private') return;

    if (!ctx.session.phone) {
      if (!ctx.message.contact) {
        this.sendPhoneRequest(ctx);
        return;
      }
      ctx.session.phone = ctx.message.contact.phone_number;
      const user = (
        await this.userService.findAll({
          phoneNumber: ctx.session.phone,
        })
      ).data[0];

      if (user) {
        ctx.session.id = user.id;
        ctx.session.first_name = user.last_name;
        ctx.session.last_name = user.first_name;
        ctx.session.email = user.email || 'skipped';
        this.sendStartMessage(ctx);
        return;
      }

      this.sendEmailRequest(ctx);
      return;
    }
    if(!ctx.session.first_name){
      ctx.session.first_name = ctx.message.text;
      this.sendEmailRequest(ctx);
      return;
    }
    if (!ctx.session.email) {
      if (!isEmail(ctx.message.text)) {
        if (ctx.message.text === "O'tkazish") {
          ctx.session.email = 'skipped';
        } else {
          this.sendEmailRequest(ctx);
        }
        const user = await this.userService.create({
          name: ctx.from.first_name + ' ' + (ctx.from.last_name || ''),
          phoneNumber: ctx.session.phone,
          email: ctx.session.email === 'skipped' ? null : ctx.session.email,
          telegramId: ctx.from.id.toString(),
        });
        ctx.session.id = user.id;
        this.sendStartMessage(ctx);
        return;
      }
      ctx.session.email = ctx.message.text;
      return;
    }

    if (ctx.message.text.startsWith('/start')) {
      const user = await this.userService.findOneByTelegramID(
        ctx.from.id.toString(),
      );
      if (!user) {
        ctx.session = {};
        this.sendPhoneRequest(ctx);
        return;
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
      return;
    }

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
      return;
    }
  }

  async onCallBack(ctx: Context) {
    const subscriptionTypeId = +ctx.match[1];
    const subscriptionType =
      await this.subscriptionTypeService.findOne(subscriptionTypeId);
    if (!subscriptionType) {
      ctx.reply('Subscription type not found');
      return;
    }

    const subscription = await this.userService.getSubscription(ctx.from.id);

    if (subscription) {
      const daysLeft = Math.ceil(
        (subscription.expiredDate.getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      );

      if (
        subscription.subscriptionTypeId == subscriptionTypeId &&
        daysLeft > 3
      ) {
        ctx.reply("siz allaqachon ushbu obunaga a'zo bo'lgansiz");
        return;
      }
    }
    const user = await this.userService.findOneByTelegramID(
      ctx.from.id.toString(),
    );

    const stripe = await this.stripeService.createCheckoutSession({
      subscriptionTypeId,
      userId: user.id,
    });

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
              gt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
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

      const daysLeft = Math.ceil(
        (sub.expiredDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      );

      if (daysLeft > 0 && daysLeft <= 3 && sub.alertCount <= 3 - daysLeft) {
        await this.bot.api.sendMessage(
          +user.telegramId,
          `Sizning obunangiz ${sub.expiredDate.toDateString()} da tugaydi. ${daysLeft} kun qoldi.`,
        );

        await this.prismaService.subscription.update({
          where: { id: sub.id },
          data: {
            alertCount: sub.alertCount + 1,
          },
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

  sendStartMessage(ctx: Context) {
    ctx.reply(`Salom Botga hush kelibsiz!`, {
      reply_markup: {
        keyboard: new Keyboard()
          .text("Obuna Bo'lish")
          .resized()
          .oneTime()
          .build(),
      },
    });
  }

  sendPhoneRequest(ctx: Context) {
    ctx.reply(
      `Telefon raqamingizni yuboring. (Raqamni yuborish tugmasi orqali)`,
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
    ctx.reply(`Emailingizni yuboring. (Yoki o'tkazish tugmasini bosing)`, {
      reply_markup: {
        keyboard: new Keyboard().text("O'tkazish").resized().build(),
      },
    });
  }
}
