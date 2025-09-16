import { Bot } from 'grammy';
import { MessageService } from 'src/modules/message/message.service';
import { SettingsService } from 'src/modules/settings/settings.service';
import { SubscriptionTypeService } from 'src/modules/subscription-type/subscription-type.service';
import { UserService } from 'src/modules/user/user.service';
import { Context } from '../Context.type';
import { TelegramSenderService } from './telegram.sender.service';
import { TelegramSubscriptionService } from './telegram.subscription.service';
export declare class TelegramCallbackService {
    readonly bot: Bot<Context>;
    private readonly userService;
    private readonly subscriptionTypeService;
    private readonly settingsService;
    private readonly messageService;
    private readonly subscriptionService;
    private readonly senderService;
    constructor(bot: Bot<Context>, userService: UserService, subscriptionTypeService: SubscriptionTypeService, settingsService: SettingsService, messageService: MessageService, subscriptionService: TelegramSubscriptionService, senderService: TelegramSenderService);
    onReactionCallBack(ctx: Context): Promise<void>;
    onSubscribeCallBack(ctx: Context): Promise<void>;
    onEditCallBack(ctx: Context): Promise<void>;
    onSettingsCallBack(ctx: Context): Promise<void>;
    onSubscriptionMenuCallBack(ctx: Context): Promise<void>;
    onStartMessageCallBack(ctx: Context): Promise<void>;
    onCancelSubscriptionCallBack(ctx: Context): Promise<void>;
    onUncancelSubscriptionCallBack(ctx: Context): Promise<void>;
    onMySubscriptionsCallBack(ctx: Context): Promise<void>;
    onAboutUsCallBack(ctx: Context): Promise<void>;
    onAboutContactCallBack(ctx: Context): Promise<void>;
}
