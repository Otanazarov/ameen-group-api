import { Injectable } from '@nestjs/common';
import { Bot, Keyboard } from 'grammy';
import { InjectBot } from '@grammyjs/nestjs';
import { Context } from './Context.type';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { env } from 'src/common/config';
import { Cron, Interval } from '@nestjs/schedule';

@Injectable()
export class TelegramService {
  constructor(
    @InjectBot() readonly bot: Bot<Context>,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
  ) {}

  @Interval(1000)
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
