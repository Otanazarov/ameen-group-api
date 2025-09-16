import { InjectBot } from '@grammyjs/nestjs';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Bot } from 'grammy';
import { env } from 'src/common/config';
import { UserService } from 'src/modules/user/user.service';
import { Context } from '../Context.type';
import { TelegramRegistrationService } from './telegram.registration.service';
import { TelegramSenderService } from './telegram.sender.service';
import { TelegramSettingsService } from './telegram.settings.service';

@Injectable()
export class TelegramMessageService {
  constructor(
    @InjectBot() readonly bot: Bot<Context>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => TelegramSenderService))
    private readonly senderService: TelegramSenderService,
    @Inject(forwardRef(() => TelegramSettingsService))
    private readonly settingsService: TelegramSettingsService,
    @Inject(forwardRef(() => TelegramRegistrationService))
    private readonly registrationService: TelegramRegistrationService,
  ) {}

  private async handleStartCommand(ctx: Context) {
    const user = await this.userService.findOneByTelegramID(
      ctx.from.id.toString(),
    );
    if (!user) {
      ctx.session = {};
      this.senderService.sendNameRequest(ctx, 1);
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
    this.senderService.sendStartMessage(ctx);
    return true;
  }

  async onMessage(ctx: Context) {
    if (ctx.chat.type != 'private') return;
    if (!ctx.session.id && (await this.registrationService.handleExistingUser(ctx)))
      return;
    if (
      ctx.message.text?.startsWith('/') &&
      (await this.handleStartCommand(ctx))
    )
      return;
    if (await this.settingsService.handleEdit(ctx)) return;
    if (await this.registrationService.handleUserRegistration(ctx)) return;
    if (await this.registrationService.handlePhoneNumber(ctx)) return;
  }
}
