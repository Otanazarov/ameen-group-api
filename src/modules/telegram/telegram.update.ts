import { Bot } from 'grammy';
import { InjectBot, Update, On, Start, Ctx } from '@grammyjs/nestjs';
import { TelegramService } from './telegram.service';
import { Context } from './Context.type';
import { isEmail } from 'class-validator';

@Update()
export class TelegramUpdate {
  constructor(
    @InjectBot()
    private readonly bot: Bot<Context>,
    private readonly telegramService: TelegramService,
  ) {
    console.log(
      'telegram Bot starting',
      this.bot ? this.bot.botInfo.id : '(booting)',
    );
  }

  @Start()
  async onStart(@Ctx() ctx: Context): Promise<void> {
    ctx.reply(`Salom Botga hush kelibsiz! boshlash uchun ismingizni yuboring.`);
  }

  @On('message')
  async onMessage(@Ctx() ctx: Context): Promise<void> {
    if (!ctx.session.name) {
      const message = ctx.message.text;
      ctx.session.name = message;
      this.telegramService.sendPhoneRequest(ctx);
      return;
    }
    if (!ctx.session.phone) {
      if (!ctx.message.contact) {
        this.telegramService.sendPhoneRequest(ctx);
        return;
      }
      ctx.session.phone = ctx.message.contact.phone_number;
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
        //TODO create new user
        ctx.reply('Registered');
        return;
      }
      ctx.session.email = ctx.message.text;
      return;
    }
  }
}
