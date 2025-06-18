import { Bot, InlineKeyboard, Keyboard } from 'grammy';
import {
  InjectBot,
  Update,
  On,
  Start,
  Ctx,
  Command,
  CallbackQuery,
} from '@grammyjs/nestjs';
import { TelegramService } from './telegram.service';
import { Context } from './Context.type';
import { isEmail } from 'class-validator';
import { UserService } from '../user/user.service';
import { SubscriptionTypeService } from '../subscription-type/subscription-type.service';
import { StripeService } from '../stripe/stripe.service';
import { env } from 'src/common/config';

@Update()
export class TelegramUpdate {
  constructor(
    @InjectBot()
    private readonly bot: Bot<Context>,
    private readonly telegramService: TelegramService,
    private readonly userService: UserService,
    private readonly subscriptionTypeService: SubscriptionTypeService,
    private readonly stripeService: StripeService,
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
  async onCallbackQuery(@Ctx() ctx: Context): Promise<void> {
    const subscriptionTypeId = +ctx.match[1];
    const subscriptionType =
      await this.subscriptionTypeService.findOne(subscriptionTypeId);
    if (!subscriptionType) {
      ctx.reply('Subscription type not found');
      return;
    }

    const subscription = await this.userService.getSubscription(ctx.from.id);

    if (subscription) {
      const daysLeft = Math.ceil(
        (subscription.expiredDate.getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      );

      if (
        subscription.subscriptionTypeId == subscriptionTypeId &&
        daysLeft > 3
      ) {
        ctx.reply("siz allaqachon ushbu obunaga a'zo bo'lgansiz");
        return;
      }
    }
    const user = await this.userService.findOneByTelegramID(
      ctx.from.id.toString(),
    );

    const stripe = await this.stripeService.createCheckoutSession({
      subscriptionTypeId,
      userId: user.id,
    });

    ctx.reply(
      `${subscriptionType.title} - ${subscriptionType.price}:\n${subscriptionType.description}\nTo'lov qilish: \n[Visa/Mastercard](${stripe.url})`,
      { parse_mode: 'Markdown' },
    );
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
    if (ctx.chat.type != 'private') return;

    if (!ctx.session.phone) {
      if (!ctx.message.contact) {
        this.telegramService.sendPhoneRequest(ctx);
        return;
      }
      ctx.session.phone = ctx.message.contact.phone_number;
      const user = (
        await this.userService.findAll({
          phoneNumber: ctx.session.phone,
        })
      ).data[0];

      if (user) {
        ctx.session.id = user.id;
        ctx.session.name = user.name;
        ctx.session.email = user.email || 'skipped';
        this.telegramService.sendStartMessage(ctx);
        return;
      }

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
        const user = await this.userService.create({
          name: ctx.from.first_name + ' ' + (ctx.from.last_name || ''),
          phoneNumber: ctx.session.phone,
          email: ctx.session.email === 'skipped' ? null : ctx.session.email,
          telegramId: ctx.from.id.toString(),
        });
        ctx.session.id = user.id;
        this.telegramService.sendStartMessage(ctx);
        return;
      }
      ctx.session.email = ctx.message.text;
      return;
    }

    if (ctx.message.text.startsWith('/start')) {
      const user = await this.userService.findOneByTelegramID(
        ctx.from.id.toString(),
      );
      if (!user) {
        ctx.session = {};
        this.telegramService.sendPhoneRequest(ctx);
        return;
      }

      const subscription = await this.userService.getSubscription(+user.telegramId);
      if (subscription?.status == 'Paid' && !user.inGroup) {
        const link = await ctx.api.createChatInviteLink(env.TELEGRAM_GROUP_ID, {
          member_limit: 1,
          name: ctx.from.first_name,
        });
        ctx.reply(link.invite_link);
      }
      this.telegramService.sendStartMessage(ctx);
      return;
    }

    if (ctx.message.text == "Obuna Bo'lish") {
      const subscriptionTypes = await this.subscriptionTypeService.findAll({
        limit: 100,
      });

      const keyboard = new InlineKeyboard();
      subscriptionTypes.data.forEach((subscriptionType) => {
        keyboard
          .text(
            `${subscriptionType.title} - ${subscriptionType.price} so'm`,
            `subscribe-${subscriptionType.id}`,
          )
          .row();
      });

      ctx.reply("Obuna Bo'lish", { reply_markup: keyboard });
      return;
    }
  }
}
