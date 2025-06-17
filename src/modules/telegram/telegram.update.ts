import { Bot, InlineKeyboard, Keyboard } from 'grammy';
import {
  InjectBot,
  Update,
  On,
  Start,
  Ctx,
  Command,
  CallbackQuery,
} from '@grammyjs/nestjs';
import { TelegramService } from './telegram.service';
import { Context } from './Context.type';
import { isEmail } from 'class-validator';
import { UserService } from '../user/user.service';
import { SubscriptionTypeService } from '../subscription-type/subscription-type.service';
import { StripeService } from '../stripe/stripe.service';
import { env } from 'src/common/config';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Update()
export class TelegramUpdate {
  constructor(
    @InjectBot()
    private readonly bot: Bot<Context>,
    private readonly telegramService: TelegramService,
    private readonly userService: UserService,
    private readonly subscriptionTypeService: SubscriptionTypeService,
    private readonly stripeService: StripeService,
    private readonly prismaService: PrismaService,
  ) {
    console.log(
      'telegram Bot starting',
      this.bot ? this.bot.botInfo.id : '(booting)',
    );
  }

  @Cron('0 0 * * *')
  async onCron() {
    await this.kickExpired();
    await this.sendAlertMessage();
  }

  async sendAlertMessage() {
    const users = await this.prismaService.user.findMany({
      where: {
        inGroup: true,
        status: 'SUBSCRIBE',
        subscription: {
          some: {
            expiredDate: {
              gt: new Date(),
              lte: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
            },
          },
        },
      },
      include: {
        subscription: true,
      },
    });

    for (const user of users) {
      const sub = await this.userService.getSubscription(user.id);
      if (!sub) continue;

      const daysLeft = Math.ceil(
        (sub.expiredDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      );

      if (daysLeft > 0 && daysLeft <= 3 && sub.alertCount === 3 - daysLeft) {
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
          some: {
            expiredDate: {
              lte: new Date(),
            },
          },
        },
      },
    });

    for (const user of users) {
      const sub = await this.userService.getSubscription(user.id);
      if (!sub) continue;
      await this.userService.update(sub.user.id, {
        inGroup: false,
        status: 'EXPIRED',
      });
      this.bot.api.banChatMember(env.TELEGRAM_GROUP_ID, +user.telegramId);
      this.bot.api.unbanChatMember(env.TELEGRAM_GROUP_ID, +user.telegramId);
    }
  }

  @Command('topicid')
  async onTopicId(@Ctx() ctx: Context): Promise<void> {
    ctx.reply(`Topic id: \`\`\`${ctx.message.message_thread_id}\`\`\``, {
      message_thread_id: ctx.message.message_thread_id,
      parse_mode: 'Markdown',
    });
  }

  @Command('id')
  async onId(@Ctx() ctx: Context): Promise<void> {
    ctx.reply(`chat id: \`\`\`${ctx.chat.id}\`\`\``, {
      message_thread_id: ctx.message.message_thread_id,
      parse_mode: 'Markdown',
    });
  }

  @Command('logout')
  async logout(ctx: Context) {
    ctx.session = {};
  }

  @CallbackQuery(/subscribe-(.+)/)
  async onCallbackQuery(@Ctx() ctx: Context): Promise<void> {
    const subscriptionTypeId = +ctx.match[1];
    const subscriptionType =
      await this.subscriptionTypeService.findOne(subscriptionTypeId);
    if (!subscriptionType) {
      ctx.reply('Subscription type not found');
      return;
    }

    const stripe = await this.stripeService.createCheckoutSession({
      subscriptionTypeId,
      userId: ctx.session.id,
    });

    ctx.reply(
      `${subscriptionType.title} - ${subscriptionType.price}:\n${subscriptionType.description}\nTo'lov qilish: \n[Visa/Mastercard](${stripe.url})`,
      { parse_mode: 'Markdown' },
    );
  }

  @On('chat_member')
  async onJoin(ctx: Context) {
    const chatMember = ctx.update.chat_member;
    if (chatMember.new_chat_member.status !== 'member') return;
    const member = chatMember.new_chat_member.user;
    const sub = await this.userService.getSubscription(member.id);

    if (sub === null) {
      await ctx.api.banChatMember(chatMember.chat.id, member.id);
      await ctx.api.unbanChatMember(chatMember.chat.id, member.id);
    } else {
      await this.userService.update(sub.user.id, { inGroup: true });
    }
  }

  @On('message')
  async onMessage(@Ctx() ctx: Context): Promise<void> {
    if (ctx.chat.type != 'private') return;
    if (!ctx.session.name) {
      const message = ctx.message.text;
      ctx.session.name = ctx.from.first_name;
      this.telegramService.sendPhoneRequest(ctx);
      return;
    }
    if (!ctx.session.phone) {
      if (!ctx.message.contact) {
        this.telegramService.sendPhoneRequest(ctx);
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
        ctx.session.name = user.name;
        ctx.session.email = user.email || 'skipped';
        this.telegramService.sendStartMessage(ctx);
        return;
      }

      this.telegramService.sendEmailRequest(ctx);
      return;
    }
    if (!ctx.session.email) {
      if (!isEmail(ctx.message.text)) {
        if (ctx.message.text === "O'tkazish") {
          ctx.session.email = 'skipped';
        } else {
          this.telegramService.sendEmailRequest(ctx);
        }
        const user = await this.userService.create({
          name: ctx.session.name,
          phoneNumber: ctx.session.phone,
          email: ctx.session.email === 'skipped' ? null : ctx.session.email,
          telegramId: ctx.from.id.toString(),
        });
        ctx.session.id = user.id;
        this.telegramService.sendStartMessage(ctx);
        return;
      }
      ctx.session.email = ctx.message.text;
      return;
    }

    if (ctx.message.text.startsWith('/start')) {
      const user = await this.userService.findOneByTelegramID(
        ctx.from.id.toString(),
      );

      if (!user.inGroup) {
        const link = await ctx.api.createChatInviteLink(env.TELEGRAM_GROUP_ID, {
          member_limit: 1,
          name: ctx.from.first_name,
        });
        ctx.reply(link.invite_link);
      }
      this.telegramService.sendStartMessage(ctx);
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
}
