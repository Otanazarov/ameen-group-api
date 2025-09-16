/* eslint-disable @typescript-eslint/no-unused-vars */
import { InjectBot } from '@grammyjs/nestjs';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InputFile, InputMediaBuilder, InlineKeyboard } from 'grammy';
import { Bot } from 'grammy';
import { join } from 'path';
import { env } from 'src/common/config';
import { MessageService } from 'src/modules/message/message.service';
import { SettingsService } from 'src/modules/settings/settings.service';
import { SubscriptionTypeService } from 'src/modules/subscription-type/subscription-type.service';
import { UserService } from 'src/modules/user/user.service';
import { Context } from '../Context.type';
import { TelegramSenderService } from './telegram.sender.service';
import { TelegramSubscriptionService } from './telegram.subscription.service';

@Injectable()
export class TelegramCallbackService {
  constructor(
    @InjectBot() readonly bot: Bot<Context>,
    private readonly userService: UserService,
    private readonly subscriptionTypeService: SubscriptionTypeService,
    private readonly settingsService: SettingsService,
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
    @Inject(forwardRef(() => TelegramSubscriptionService))
    private readonly subscriptionService: TelegramSubscriptionService,
    @Inject(forwardRef(() => TelegramSenderService))
    private readonly senderService: TelegramSenderService,
  ) {}

  async onReactionCallBack(ctx: Context) {
    const messageId = ctx.match[1];
    await this.messageService.update(+messageId, { status: 'READ' });
    await ctx.answerCallbackQuery('✅ Reaksiya bildirildi');
  }

  async onSubscribeCallBack(ctx: Context) {
    const subscriptionTypeId = +ctx.match[1];
    const result = await this.subscriptionService.handleSubscriptionPayment(
      ctx,
      subscriptionTypeId,
    );
    if (!result) return;
    await this.senderService.sendSubscriptionPaymentInfo(ctx, result as any);
  }

  async onEditCallBack(ctx: Context) {
    const editName = ctx.match[1];
    ctx.session.edit = editName;
    const backKeyboard = new InlineKeyboard().text('⬅️ Orqaga', 'settings');
    let text = '';
    if (editName == 'firstname') {
      text = '👤 Yangi ismni kiriting';
    } else if (editName == 'lastname') {
      text = '👥 Yangi familyani kiriting';
    } else if (editName == 'email') {
      text = '📧 Yangi emailni kiriting';
    }
    const message = await ctx.editMessageText(text, {
      reply_markup: backKeyboard,
    });
    if (typeof message === 'object') {
      ctx.session.message_id = message.message_id;
    }
  }

  async onSettingsCallBack(ctx: Context) {
    delete ctx.session.edit;
    await this.senderService.sendSettingsMessage(ctx);
  }

  async onSubscriptionMenuCallBack(ctx: Context) {
    await this.senderService.sendSubscriptionMenu(ctx);
  }

  async onStartMessageCallBack(ctx: Context) {
    const text = (await this.settingsService.findOne()).startMessage;
    try {
      await ctx.editMessageText(text, {
        reply_markup: this.senderService.DEFAULT_KEYBOARD as any,
      });
    } catch (e) {
      await ctx.deleteMessage();
      await ctx.reply(text, {
        reply_markup: this.senderService.DEFAULT_KEYBOARD as any,
      });
    }
  }

  async onCancelSubscriptionCallBack(ctx: Context) {
    const subscription = await this.userService.getSubscription(ctx.from.id);
    if (!subscription) {
      await ctx.answerCallbackQuery({
        text: '❌ Sizda hozircha faol obuna mavjud emas',
        show_alert: true,
      });
      return;
    }
    try {
      const user = await this.userService.cancelSubscription(
        ctx.from.id.toString(),
      );
      try {
        await ctx.api.banChatMember(env.TELEGRAM_GROUP_ID, ctx.from.id);
      } catch {}
      await this.userService.update(user.id, { inGroup: false });
      await ctx.answerCallbackQuery({ text: 'Obuna bekor qilindi' });
      await this.onStartMessageCallBack(ctx);
    } catch (e) {
      console.log(e);
      await ctx.answerCallbackQuery({
        text: 'Obuna bekor qilishda muomoga chiqdi',
      });
    }
  }

  async onUncancelSubscriptionCallBack(ctx: Context) {
    const subscription = await this.userService.getSubscription(
      ctx.from.id,
      false,
    );
    if (!subscription) {
      await ctx.answerCallbackQuery({
        text: '❌ Sizda obuna mavjud emas',
        show_alert: true,
      });
      return;
    }
    try {
      await this.userService.uncancelSubscription(ctx.from.id.toString());
      await ctx.answerCallbackQuery({ text: 'Obuna tiklandi' });
      const link = await ctx.api.createChatInviteLink(env.TELEGRAM_GROUP_ID, {
        name: ctx.from.first_name,
        creates_join_request: true,
      });
      await ctx.reply(
        "🎉 Guruhga qo'shilish uchun havola: " + link.invite_link,
      );
      await this.onStartMessageCallBack(ctx);
    } catch (e) {
      console.log(e);
      await ctx.answerCallbackQuery({
        text: 'Obuna tiklashda muomoga chiqdi',
      });
    }
  }

  async onMySubscriptionsCallBack(ctx: Context) {
    const subscription = await this.userService.getSubscription(ctx.from.id);
    const keyboard = new InlineKeyboard();
    if (!subscription) {
      const canceledSubscription = await this.userService.getSubscription(
        ctx.from.id,
        false,
      );
      if (canceledSubscription) {
        keyboard.text('Obunani Tiklash', 'uncancel_subscription');
        keyboard.row();
      }
      keyboard.text('⬅️ Orqaga', 'start_message');
      await ctx.editMessageText('❌ Sizda hozircha faol obuna mavjud emas', {
        reply_markup: keyboard,
      });
      return;
    }
    keyboard.text('Bekor Qilish', 'cancel_subscription');
    keyboard.row();
    keyboard.text('⬅️ Orqaga', 'start_message');
    const daysLeft = this.subscriptionService.calculateDaysLeft(
      subscription.expiredDate,
    );
    const subscriptionType = await this.subscriptionTypeService.findOne(
      subscription.subscriptionTypeId,
    );
    const text =
      `📌 Obuna turi: ${subscriptionType.title}
` +
      `💰 Narxi: ${subscriptionType.price} so'm
` +
      `📅 Tugash sanasi: ${subscription.expiredDate.toLocaleDateString()}
` +
      `⏳ Qolgan kunlar: ${daysLeft} kun`;
    await ctx.editMessageText(text, { reply_markup: keyboard });
  }

  async onAboutUsCallBack(ctx: Context) {
    const settings = await this.settingsService.findOne();
    const keyboard = new InlineKeyboard().text('⬅️ Orqaga', 'start_message');
    try {
      if (settings.aboutAminGroupImage) {
        const filePath = join(
          __dirname,
          '..',
          '..',
          '..',
          'public',
          settings.aboutAminGroupImage.url,
        );
        await ctx.editMessageMedia(
          InputMediaBuilder.photo(new InputFile(filePath), {
            caption: settings.aboutAminGroup,
            parse_mode: 'Markdown',
          }),
          { reply_markup: keyboard },
        );
      } else {
        await ctx.editMessageText(settings.aboutAminGroup, {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        });
      }
    } catch (e) {
      await ctx.deleteMessage().catch(() => {});
      if (settings.aboutAminGroupImage) {
        const filePath = join(
          __dirname,
          '..',
          '..',
          '..',
          'public',
          settings.aboutAminGroupImage.url,
        );
        await ctx.replyWithPhoto(new InputFile(filePath), {
          caption: settings.aboutAminGroup,
          parse_mode: 'Markdown',
        });
      } else {
        await ctx.reply(settings.aboutAminGroup, {
          parse_mode: 'Markdown',
        });
      }
    }
  }

  async onAboutContactCallBack(ctx: Context) {
    const settings = await this.settingsService.findOne();
    const keyboard = new InlineKeyboard().text('⬅️ Orqaga', 'start_message');
    try {
      if (settings.contactImage) {
        const filePath = join(
          __dirname,
          '..',
          '..',
          '..',
          'public',
          settings.contactImage.url,
        );
        await ctx.editMessageMedia(
          InputMediaBuilder.photo(new InputFile(filePath), {
            caption: settings.contactMessage,
            parse_mode: 'Markdown',
          }),
          { reply_markup: keyboard },
        );
      } else {
        await ctx.editMessageText(settings.contactMessage, {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        });
      }
    } catch (e) {
      await ctx.deleteMessage().catch(() => {});
      if (settings.contactImage) {
        const filePath = join(
          __dirname,
          '..',
          '..',
          '..',
          'public',
          settings.contactImage.url,
        );
        await ctx.replyWithPhoto(new InputFile(filePath), {
          caption: settings.contactMessage,
          parse_mode: 'Markdown',
        });
      } else {
        await ctx.reply(settings.contactMessage, {
          parse_mode: 'Markdown',
        });
      }
    }
  }
}
