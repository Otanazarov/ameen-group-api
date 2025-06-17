import { Injectable } from '@nestjs/common';
import { Bot, Keyboard } from 'grammy';
import { InjectBot } from '@grammyjs/nestjs';
import { Context } from './Context.type';

@Injectable()
export class TelegramService {
  constructor(@InjectBot() readonly bot: Bot<Context>) {}

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
