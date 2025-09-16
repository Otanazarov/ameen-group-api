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
import { SubscriptionTypeService } from '../subscription-type/subscription-type.service';
import { UserService } from '../user/user.service';
import { Context } from './Context.type';
import { TelegramButtonService } from './services/telegram.button.service';
import { TelegramService } from './telegram.service';

@Update()
export class TelegramUpdate {
  constructor(
    @InjectBot()
    private readonly bot: Bot<Context>,
    private readonly telegramService: TelegramService,
    private readonly userService: UserService,
    private readonly subscriptionTypeService: SubscriptionTypeService,
    private readonly buttonService: TelegramButtonService,
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
    ctx.reply(`Topic id: 
${ctx.message.message_thread_id}`, {
      message_thread_id: ctx.message.message_thread_id,
      parse_mode: 'Markdown',
    });
  }

  @Command('id')
  async onId(@Ctx() ctx: Context): Promise<void> {
    ctx.reply(`chat id: 
${ctx.chat.id}`, {
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
    this.telegramService.callbackService.onSubscribeCallBack(ctx);
  }

  @CallbackQuery(/edit_(.+)/)
  async onEditCallbackQuery(@Ctx() ctx: Context): Promise<void> {
    this.telegramService.callbackService.onEditCallBack(ctx);
  }

  @CallbackQuery(/reaction_(.+)/)
  async onReactionCallbackQuery(@Ctx() ctx: Context): Promise<void> {
    this.telegramService.callbackService.onReactionCallBack(ctx);
  }

  @CallbackQuery('settings')
  async onSettingsCallbackQuery(@Ctx() ctx: Context): Promise<void> {
    this.telegramService.callbackService.onSettingsCallBack(ctx);
  }

  @CallbackQuery('start_message')
  async onStartMessageCallbackQuery(@Ctx() ctx: Context): Promise<void> {
    this.telegramService.callbackService.onStartMessageCallBack(ctx);
  }

  @CallbackQuery('subscribe_menu')
  async onSubscriptionMenuCallbackQuery(@Ctx() ctx: Context): Promise<void> {
    this.telegramService.callbackService.onSubscriptionMenuCallBack(ctx);
  }

  @CallbackQuery('cancel_subscription')
  async onCancelSubscriptionCallbackQuery(@Ctx() ctx: Context): Promise<void> {
    this.telegramService.callbackService.onCancelSubscriptionCallBack(ctx);
  }

  @CallbackQuery('uncancel_subscription')
  async onUncancelSubscriptionCallbackQuery(
    @Ctx() ctx: Context,
  ): Promise<void> {
    this.telegramService.callbackService.onUncancelSubscriptionCallBack(ctx);
  }

  @CallbackQuery('my_subscriptions')
  async onMySubscriptionsCallbackQuery(@Ctx() ctx: Context): Promise<void> {
    this.telegramService.callbackService.onMySubscriptionsCallBack(ctx);
  }

  @CallbackQuery('about_us')
  async onAboutUsCallbackQuery(@Ctx() ctx: Context): Promise<void> {
    this.telegramService.callbackService.onAboutUsCallBack(ctx);
  }

  @CallbackQuery('contact')
  async onAboutTeacherCallbackQuery(@Ctx() ctx: Context): Promise<void> {
    this.telegramService.callbackService.onAboutContactCallBack(ctx);
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
    const text = ctx.message.text;
    if (!text) {
      this.telegramService.messageService.onMessage(ctx);
      return;
    }

    const buttonData = this.buttonService.getButtonData(text);
    if (buttonData) {
      ctx.match = [text, buttonData];
      const action = buttonData;
      switch (action) {
        case 'start':
          this.telegramService.callbackService.onStartMessageCallBack(ctx);
          break;
        case 'settings':
          this.telegramService.callbackService.onSettingsCallBack(ctx);
          break;
        case 'subscribe':
          this.telegramService.callbackService.onSubscriptionMenuCallBack(ctx);
          break;
        case 'about':
          this.telegramService.callbackService.onAboutUsCallBack(ctx);
          break;
        case 'contact':
          this.telegramService.callbackService.onAboutContactCallBack(ctx);
          break;
        default:
          this.telegramService.messageService.onMessage(ctx);
          break;
      }
      return;
    }

    this.telegramService.messageService.onMessage(ctx);
  }
}
