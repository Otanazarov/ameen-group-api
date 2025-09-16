import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { isEmail } from 'class-validator';
import { UserService } from 'src/modules/user/user.service';
import { Context } from '../Context.type';
import { TelegramSenderService } from './telegram.sender.service';

@Injectable()
export class TelegramSettingsService {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => TelegramSenderService))
    private readonly senderService: TelegramSenderService,
  ) {}

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
        await this.senderService.sendSettingsMessage(
          ctx,
          ctx.session.message_id,
        );
        delete ctx.session.message_id;
      } else {
        await this.senderService.sendSettingsMessage(ctx);
      }
      return true;
    }
    return false;
  }
}
