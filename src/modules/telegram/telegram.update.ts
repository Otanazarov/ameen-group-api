import { Bot, InlineKeyboard, Keyboard } from 'grammy';
import {
  InjectBot,
  Update,
  On,
  Ctx,
  Command,
  CallbackQuery,
} from '@grammyjs/nestjs';
import { TelegramService } from './telegram.service';
import { Context } from './Context.type';
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
    bot.catch((err) => {
      console.log('Error in telegram bot', err);
      return true;
    });
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
  async onSubscribeCallbackQuery(@Ctx() ctx: Context): Promise<void> {
    this.telegramService.onSubscribeCallBack(ctx);
  }

  @CallbackQuery(/edit_(.+)/)
  async onEditCallbackQuery(@Ctx() ctx: Context): Promise<void> {
    this.telegramService.onEditCallBack(ctx);
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
    this.telegramService.onMessage(ctx);
  }
}
