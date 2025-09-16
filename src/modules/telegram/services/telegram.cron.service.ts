import { InjectBot } from '@grammyjs/nestjs';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Bot } from 'grammy';
import { env } from 'src/common/config';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserService } from 'src/modules/user/user.service';
import { Context } from '../Context.type';
import { TelegramSenderService } from './telegram.sender.service';
import { TelegramSubscriptionService } from './telegram.subscription.service';

@Injectable()
export class TelegramCronService {
  private cronRunning = false;
  private readonly MS_PER_DAY = 1000 * 60 * 60 * 24;

  constructor(
    @InjectBot() readonly bot: Bot<Context>,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => TelegramSenderService))
    private readonly senderService: TelegramSenderService,
    @Inject(forwardRef(() => TelegramSubscriptionService))
    private readonly subscriptionService: TelegramSubscriptionService,
  ) {}

  @Interval(10000)
  async onCron() {
    if (this.cronRunning) return;
    this.cronRunning = true;
    await this.kickExpired();
    await this.sendAlertMessage();
    await this.senderService.sendMessages();
    this.cronRunning = false;
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
      const daysLeft = this.subscriptionService.calculateDaysLeft(sub.expiredDate);
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
}
