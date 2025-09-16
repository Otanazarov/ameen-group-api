import { Bot } from 'grammy';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserService } from 'src/modules/user/user.service';
import { Context } from '../Context.type';
import { TelegramSenderService } from './telegram.sender.service';
import { TelegramSubscriptionService } from './telegram.subscription.service';
export declare class TelegramCronService {
    readonly bot: Bot<Context>;
    private readonly prismaService;
    private readonly userService;
    private readonly senderService;
    private readonly subscriptionService;
    private cronRunning;
    private readonly MS_PER_DAY;
    constructor(bot: Bot<Context>, prismaService: PrismaService, userService: UserService, senderService: TelegramSenderService, subscriptionService: TelegramSubscriptionService);
    onCron(): Promise<void>;
    sendAlertMessage(): Promise<void>;
    kickExpired(): Promise<void>;
}
