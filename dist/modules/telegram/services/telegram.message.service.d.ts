import { Bot } from 'grammy';
import { UserService } from 'src/modules/user/user.service';
import { Context } from '../Context.type';
import { TelegramRegistrationService } from './telegram.registration.service';
import { TelegramSenderService } from './telegram.sender.service';
import { TelegramSettingsService } from './telegram.settings.service';
export declare class TelegramMessageService {
    readonly bot: Bot<Context>;
    private readonly userService;
    private readonly senderService;
    private readonly settingsService;
    private readonly registrationService;
    constructor(bot: Bot<Context>, userService: UserService, senderService: TelegramSenderService, settingsService: TelegramSettingsService, registrationService: TelegramRegistrationService);
    private handleStartCommand;
    onMessage(ctx: Context): Promise<void>;
}
