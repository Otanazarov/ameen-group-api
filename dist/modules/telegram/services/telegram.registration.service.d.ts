import { Bot } from 'grammy';
import { UserService } from 'src/modules/user/user.service';
import { Context } from '../Context.type';
import { TelegramSenderService } from './telegram.sender.service';
export declare class TelegramRegistrationService {
    readonly bot: Bot<Context>;
    private readonly userService;
    private readonly senderService;
    constructor(bot: Bot<Context>, userService: UserService, senderService: TelegramSenderService);
    private updateUserSession;
    handleExistingUser(ctx: Context): Promise<boolean>;
    handleUserRegistration(ctx: Context): Promise<boolean>;
    handlePhoneNumber(ctx: Context): Promise<boolean>;
}
