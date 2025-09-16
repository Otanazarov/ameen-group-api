import { InjectBot } from '@grammyjs/nestjs';
import { Injectable } from '@nestjs/common';
import {
  File,
  Message,
  MessageUser,
  Prisma,
  User,
} from '@prisma/client';
import {
  Bot,
  InlineKeyboard,
  InputFile,
  InputMediaBuilder,
  Keyboard,
} from 'grammy';
import { join } from 'path';
import { env } from 'src/common/config';
import { MessageService } from 'src/modules/message/message.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { SettingsService } from 'src/modules/settings/settings.service';
import { SubscriptionTypeService } from 'src/modules/subscription-type/subscription-type.service';
import { UserService } from 'src/modules/user/user.service';
import { Context } from '../Context.type';
import { TelegramButtonService } from './telegram.button.service';

@Injectable()
export class TelegramSenderService {
  public DEFAULT_KEYBOARD: Keyboard;

  constructor(
    @InjectBot() readonly bot: Bot<Context>,
    private readonly prismaService: PrismaService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly settingsService: SettingsService,
    private readonly buttonService: TelegramButtonService,
    private readonly subscriptionTypeService: SubscriptionTypeService,
  ) {}

  async setDefaultKeyboard() {
    const defaultButtons = await this.buttonService.allButtons;
    const keyboard = new Keyboard();

    keyboard.webApp("🔥 Obuna Bo'lish", `https://example.com/subscription`);

    defaultButtons
      .filter((b) => b.default)
      .sort((a, b) => a.id - b.id)
      .forEach((button, index) => {
        keyboard.text(button.text);
        if (index % 2 !== 1) {
          keyboard.row();
        }
      });
    this.DEFAULT_KEYBOARD = keyboard.resized();
  }

  public async sendMessage(
    message: MessageUser & {
      user: User;
      message: Message & {
        files: File[];
        buttonPlacement: Prisma.InlineButtonPlacementGetPayload<{
          include: { button: true };
        }>[];
      };
    },
  ) {
    try {
      // eslint-disable-next-line prefer-const
      let { text, files } = message.message;

      const replyMarkup = new InlineKeyboard().text(
        'Reaksiya Bildirish',
        `reaction_${message.id}`,
      );

      const commonOptions: any = {
        caption: text,
        parse_mode: 'Markdown',
        reply_markup: replyMarkup,
      };

      await this.messageService.update(message.id, { status: 'SENDING' });

      if (files.length > 0) {
        if (files.length == 1) {
          const file = files[0];
          const filePath = join(
            __dirname,
            '..',
            '..',
            '..',
            'public',
            file.url,
          );
          const inputFile = new InputFile(filePath);
          if (file.mimetype.startsWith('image')) {
            await this.bot.api.sendPhoto(message.user.telegramId, inputFile, {
              ...commonOptions,
            });
          } else if (file.mimetype.startsWith('video')) {
            await this.bot.api.sendVideo(message.user.telegramId, inputFile, {
              ...commonOptions,
            });
          } else {
            await this.bot.api.sendDocument(
              message.user.telegramId,
              inputFile,
              {
                ...commonOptions,
              },
            );
          }
        } else {
          const inputFiles = files.map((file) => {
            const filePath = join(
              __dirname,
              '..',
              '..',
              '..',
              'public',
              file.url,
            );

            if (file.mimetype.startsWith('image')) {
              return InputMediaBuilder.photo(new InputFile(filePath), {
                ...commonOptions,
              });
            } else if (file.mimetype.startsWith('video')) {
              return InputMediaBuilder.video(new InputFile(filePath), {
                ...commonOptions,
              });
            } else {
              return InputMediaBuilder.document(new InputFile(filePath), {
                ...commonOptions,
              });
            }
          });
          inputFiles[inputFiles.length - 1];
          await this.bot.api.sendMediaGroup(
            message.user.telegramId,
            inputFiles,
          );
        }
      } else {
        await this.bot.api.sendMessage(message.user.telegramId, text, {
          reply_markup: replyMarkup,
          parse_mode: 'Markdown',
        });
      }
      await this.messageService.update(message.id, { status: 'DELIVERED' });
    } catch (e) {
      console.log(e);
      await this.messageService.update(message.id, { status: 'NOTSENT' });
    }
  }

  async sendMessages() {
    const messages = await this.prismaService.messageUser.findMany({
      where: { status: 'PENDING' },
      take: 20,
      include: {
        user: true,
        message: {
          include: {
            files: true,
            buttonPlacement: { include: { button: true } },
          },
        },
      },
    });
    for (const message of messages) {
      await this.sendMessage(message as any);
    }
  }

  async sendSubscriptionMenu(ctx: Context) {
    const subscriptionTypes = await this.subscriptionTypeService.findAll({
      limit: 100,
    });
    const keyboard = new InlineKeyboard();
    subscriptionTypes.data.forEach((subscriptionType) => {
      keyboard
        .text(
          `💫 ${subscriptionType.title} - ${subscriptionType.price} so'm / ${subscriptionType.expireDays} kun`,
          `subscribe-${subscriptionType.id}`,
        )
        .row();
    });
    keyboard.text('⬅️ Orqaga', 'start_message').row();
    const text = "🔥 Obuna Bo'lish";
    if (subscriptionTypes.data.length == 0) {
      if (ctx.callbackQuery) {
        await ctx.editMessageText(
          "❌ Obunalar mavjud emas iltimos keyinroq urunib ko'ring",
          { reply_markup: keyboard },
        );
      } else {
        await ctx.reply(
          "❌ Obunalar mavjud emas iltimos keyinroq urunib ko'ring",
          { reply_markup: keyboard },
        );
      }
      return;
    }
    if (ctx.callbackQuery) {
      await ctx.editMessageText(text, { reply_markup: keyboard });
    } else {
      await ctx.reply(text, { reply_markup: keyboard });
    }
  }

  async sendSettingsMessage(ctx: Context, messageId?: number) {
    const keyboard = new InlineKeyboard()
      .text("👤 Ismni o'zgartitirish", 'edit_firstname')
      .row()
      .text("👥 Familyani o'zgartitirish", 'edit_lastname')
      .row()
      .text("📧 Emailni o'zgartitirish", 'edit_email')
      .row()
      .text('⬅️ Orqaga', 'start_message');
    const user = await this.userService.findOneByTelegramID(
      ctx.from.id.toString(),
    );
    const text =
      `⚙️ Sozlamalar

` +
      `👤 Ism: ${user.firstName}
` +
      `👥 Familya: ${user.lastName}
` +
      `📧 Email: ${user.email || 'Kiritilmagan'}
` +
      `📱 Telefon: ${user.phoneNumber}`;
    if (messageId) {
      await this.bot.api.editMessageText(ctx.chat.id, messageId, text, {
        reply_markup: keyboard,
      });
    } else if (ctx.callbackQuery) {
      await ctx.editMessageText(text, { reply_markup: keyboard });
    } else {
      await ctx.reply(text, { reply_markup: keyboard });
    }
  }

  async sendStartMessage(ctx: Context) {
    await this.setDefaultKeyboard();

    const text = (await this.settingsService.findOne()).startMessage;
    ctx.reply(text, {
      reply_markup: { ...this.DEFAULT_KEYBOARD, remove_keyboard: true },
    });
  }

  sendNameRequest(ctx: Context, step: number) {
    if (step == 1) {
      ctx.reply(`👤 Iltimos, ismingizni yuboring.`);
    } else if (step == 2) {
      ctx.reply(`👥 Iltimos, familiyangizni yuboring.`);
    }
  }

  sendPhoneRequest(ctx: Context) {
    ctx.reply(
      `👋 ${ctx.session.last_name} ${ctx.session.first_name} to'rayevning rasmiy kanaliga xush kelibsiz!
📱 BOTning qo'shimcha imkoniyatlaridan foydalanish uchun telefon raqamingizni yuboring!`,
      {
        reply_markup: new Keyboard()
          .requestContact('📱 Raqamni yuborish')
          .resized()
          .oneTime(),
      },
    );
  }

  sendEmailRequest(ctx: Context, type = 1) {
    if (type == 1) {
      ctx.reply(
        `📧 Iltimos email manzilingizni kiriting!`,
        {
          reply_markup: new Keyboard().text('⏭ O\'tkazish').resized().oneTime(),
        },
      );
    } else {
      ctx.reply(`📧 Iltimos Email yuboring`, {
        reply_markup: new Keyboard().text('⏭ O\'tkazish').resized().oneTime(),
      });
    }
  }

  async sendSubscriptionPaymentInfo(
    ctx: Context,
    sessions: {
      subscriptionType: any;
      octobank: any;
      atmos: any;
    },
  ) {
    const { subscriptionType } = sessions;
    const keyboard = new InlineKeyboard()
      .url('💳 Visa/Mastercard', sessions.octobank.octo_pay_url)
      .row()
      .url(
        '💳 ATMOS',
        `${env.FRONTEND_URL}atmos/card?transaction_id=` +
          sessions.atmos.transactionId,
      )
      .row()
      .text('⬅️ Orqaga', 'subscribe_menu');
    await ctx.deleteMessage();
    await ctx.reply(
      `💫 ${subscriptionType.title} - ${subscriptionType.price}:
${subscriptionType.description}`,
      { parse_mode: 'Markdown', reply_markup: keyboard },
    );
  }
}
