import { Injectable } from '@nestjs/common';
import { Bot, Context, Keyboard } from 'grammy';
import { InjectBot } from '@grammyjs/nestjs';
import { env } from 'src/common/config';

@Injectable()
export class TelegramService {
  constructor(@InjectBot() readonly bot: Bot<Context>) {}

  sendPhoneRequest(ctx: Context) {
    ctx.reply(
      `Telefon raqamingizni yuboring. (Raqamni yuborish tugmasi orqali)`,
      {
        reply_markup: {
          keyboard: new Keyboard()
            .requestContact('Raqamni yuborish')
            .resized()
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
