import { InjectBot } from '@grammyjs/nestjs';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Bot } from 'grammy';
import { UserService } from 'src/modules/user/user.service';
import { Context } from '../Context.type';
import { TelegramSenderService } from './telegram.sender.service';

@Injectable()
export class TelegramRegistrationService {
  constructor(
    @InjectBot() readonly bot: Bot<Context>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => TelegramSenderService))
    private readonly senderService: TelegramSenderService,
  ) {}

  private async updateUserSession(ctx: Context, user: any) {
    ctx.session.id = user.id;
    ctx.session.phone = user.phoneNumber;
    ctx.session.first_name = user.firstName;
    ctx.session.last_name = user.lastName;
    ctx.session.email = user.email || 'skipped';
  }

  async handleExistingUser(ctx: Context) {
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

  async handleUserRegistration(ctx: Context) {
    if (!ctx.session.first_name) {
      ctx.session.first_name = ctx.message.text;
      this.senderService.sendNameRequest(ctx, 2);
      return true;
    }
    if (!ctx.session.last_name) {
      ctx.session.last_name = ctx.message.text;
      this.senderService.sendPhoneRequest(ctx);
      return true;
    }
    return false;
  }

  async handlePhoneNumber(ctx: Context) {
    if (!ctx.session.phone) {
      if (!ctx.message.contact) {
        this.senderService.sendPhoneRequest(ctx);
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

      this.senderService.sendStartMessage(ctx);
      return true;
    }
    return false;
  }
}
