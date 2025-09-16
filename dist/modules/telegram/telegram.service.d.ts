import { OnModuleInit } from '@nestjs/common';
import { Bot } from 'grammy';
import { Context } from './Context.type';
import { TelegramCallbackService } from './services/telegram.callback.service';
import { TelegramCronService } from './services/telegram.cron.service';
import { TelegramMessageService } from './services/telegram.message.service';
import { TelegramRegistrationService } from './services/telegram.registration.service';
import { TelegramSenderService } from './services/telegram.sender.service';
export declare class TelegramService implements OnModuleInit {
    readonly bot: Bot<Context>;
    readonly senderService: TelegramSenderService;
    readonly callbackService: TelegramCallbackService;
    readonly registrationService: TelegramRegistrationService;
    readonly cronService: TelegramCronService;
    readonly messageService: TelegramMessageService;
    constructor(bot: Bot<Context>, senderService: TelegramSenderService, callbackService: TelegramCallbackService, registrationService: TelegramRegistrationService, cronService: TelegramCronService, messageService: TelegramMessageService);
    onModuleInit(): Promise<void>;
}
