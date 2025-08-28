import {
  CallbackQuery,
  Command,
  Ctx,
  InjectBot,
  On,
  Update,
} from '@grammyjs/nestjs';
import { Bot } from 'grammy';
import { env } from 'src/common/config';
import { UserService } from '../user/user.service';
import { Context } from './Context.type';
import { TelegramService } from './telegram.service';

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
    bot.use((ctx, next) => {
      if (ctx.session.id)
        this.userService.update(ctx.session.id, { lastActiveAt: new Date() });
      next();
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

  @CallbackQuery(/reaction_(.+)/)
  async onReactionCallbackQuery(@Ctx() ctx: Context): Promise<void> {
    this.telegramService.onReactionCallBack(ctx);
  }

  @CallbackQuery('settings')
  async onSettingsCallbackQuery(@Ctx() ctx: Context): Promise<void> {
    this.telegramService.onSettingsCallBack(ctx);
  }

  @CallbackQuery('start_message')
  async onStartMessageCallbackQuery(@Ctx() ctx: Context): Promise<void> {
    this.telegramService.onStartMessageCallBack(ctx);
  }

  @CallbackQuery('subscribe_menu')
  async onSubscriptionMenuCallbackQuery(@Ctx() ctx: Context): Promise<void> {
    this.telegramService.onSubscriptionMenuCallBack(ctx);
  }

  @CallbackQuery('cancel_subscription')
  async onCancelSubscriptionCallbackQuery(@Ctx() ctx: Context): Promise<void> {
    this.telegramService.onCancelSubscriptionCallBack(ctx);
  }

  @CallbackQuery('my_subscriptions')
  async onMySubscriptionsCallbackQuery(@Ctx() ctx: Context): Promise<void> {
    this.telegramService.onMySubscriptionsCallBack(ctx);
  }

  @CallbackQuery('about_us')
  async onAboutUsCallbackQuery(@Ctx() ctx: Context): Promise<void> {
    this.telegramService.onAboutUsCallBack(ctx);
  }

  @CallbackQuery('about_owner')
  async onAboutTeacherCallbackQuery(@Ctx() ctx: Context): Promise<void> {
    this.telegramService.onAboutTeacherCallBack(ctx);
  }

  @On('chat_join_request')
  async onJoin(ctx: Context) {
    const chatMember = ctx.update.chat_join_request;
    if (chatMember.chat.id.toString() !== env.TELEGRAM_GROUP_ID) return;
    const member = chatMember.from;
    const sub = await this.userService.getSubscription(member.id);

    if (sub === null) {
      await ctx.api.declineChatJoinRequest(chatMember.chat.id, member.id);
    } else {
      await ctx.api.approveChatJoinRequest(chatMember.chat.id, member.id);
      await this.userService.update(sub.user.id, { inGroup: true });
    }
  }

  @On('message')
  async onMessage(@Ctx() ctx: Context): Promise<void> {
    this.telegramService.onMessage(ctx);
  }
}
