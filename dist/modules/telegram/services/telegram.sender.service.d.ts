import { File, Message, MessageUser, Prisma, User } from '@prisma/client';
import { Bot, Keyboard } from 'grammy';
import { MessageService } from 'src/modules/message/message.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { SettingsService } from 'src/modules/settings/settings.service';
import { SubscriptionTypeService } from 'src/modules/subscription-type/subscription-type.service';
import { UserService } from 'src/modules/user/user.service';
import { Context } from '../Context.type';
import { TelegramButtonService } from './telegram.button.service';
export declare class TelegramSenderService {
    readonly bot: Bot<Context>;
    private readonly prismaService;
    private readonly messageService;
    private readonly userService;
    private readonly settingsService;
    private readonly buttonService;
    private readonly subscriptionTypeService;
    DEFAULT_KEYBOARD: Keyboard;
    constructor(bot: Bot<Context>, prismaService: PrismaService, messageService: MessageService, userService: UserService, settingsService: SettingsService, buttonService: TelegramButtonService, subscriptionTypeService: SubscriptionTypeService);
    setDefaultKeyboard(): Promise<void>;
    sendMessage(message: MessageUser & {
        user: User;
        message: Message & {
            files: File[];
            buttonPlacement: Prisma.InlineButtonPlacementGetPayload<{
                include: {
                    button: true;
                };
            }>[];
        };
    }): Promise<void>;
    sendMessages(): Promise<void>;
    sendSubscriptionMenu(ctx: Context): Promise<void>;
    sendSettingsMessage(ctx: Context, messageId?: number): Promise<void>;
    sendStartMessage(ctx: Context): Promise<void>;
    sendNameRequest(ctx: Context, step: number): void;
    sendPhoneRequest(ctx: Context): void;
    sendEmailRequest(ctx: Context, type?: number): void;
    sendSubscriptionPaymentInfo(ctx: Context, sessions: {
        subscriptionType: any;
        octobank: any;
        atmos: any;
    }): Promise<void>;
}
