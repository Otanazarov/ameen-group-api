import { Bot } from 'grammy';
import { InjectBot, Update, On, Start, Ctx, Command } from '@grammyjs/nestjs';
import { TelegramService } from './telegram.service';
import { Context } from './Context.type';
import { isEmail } from 'class-validator';
import { UserService } from '../user/user.service';

@Update()
export class TelegramUpdate {
  constructor(
    @InjectBot()
    private readonly bot: Bot<Context>,
    private readonly telegramService: TelegramService,
    private readonly userService: UserService,
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

  @Command('topicid')
  async onTopicId(@Ctx() ctx: Context): Promise<void> {
    ctx.reply(`Topic id: \`\`\`${ctx.message.message_thread_id}\`\`\``);
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
        console.log(ctx.session);
        const user = await this.userService.create({
          name: ctx.session.name,
          phoneNumber: ctx.session.phone,
          email: ctx.session.email,
          telegramId: ctx.from.id.toString(),
        });
        ctx.reply('Registered');
        return;
      }
      ctx.session.email = ctx.message.text;
      return;
    }
  }
}
