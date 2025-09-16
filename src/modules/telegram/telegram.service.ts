import { InjectBot } from '@grammyjs/nestjs';
import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Bot } from 'grammy';
import { Context } from './Context.type';
import { TelegramCallbackService } from './services/telegram.callback.service';
import { TelegramCronService } from './services/telegram.cron.service';
import { TelegramMessageService } from './services/telegram.message.service';
import { TelegramRegistrationService } from './services/telegram.registration.service';
import { TelegramSenderService } from './services/telegram.sender.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  constructor(
    @InjectBot() readonly bot: Bot<Context>,
    @Inject(forwardRef(() => TelegramSenderService))
    readonly senderService: TelegramSenderService,
    @Inject(forwardRef(() => TelegramCallbackService))
    readonly callbackService: TelegramCallbackService,
    @Inject(forwardRef(() => TelegramRegistrationService))
    readonly registrationService: TelegramRegistrationService,
    @Inject(forwardRef(() => TelegramCronService))
    readonly cronService: TelegramCronService,
    @Inject(forwardRef(() => TelegramMessageService))
    readonly messageService: TelegramMessageService,
  ) {}

  async onModuleInit() {
    await this.senderService.setDefaultKeyboard();
  }
}
