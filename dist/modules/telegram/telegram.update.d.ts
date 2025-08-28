import { Bot } from 'grammy';
import { UserService } from '../user/user.service';
import { Context } from './Context.type';
import { TelegramService } from './telegram.service';
export declare class TelegramUpdate {
    private readonly bot;
    private readonly telegramService;
    private readonly userService;
    constructor(bot: Bot<Context>, telegramService: TelegramService, userService: UserService);
    onTopicId(ctx: Context): Promise<void>;
    onId(ctx: Context): Promise<void>;
    logout(ctx: Context): Promise<void>;
    onSubscribeCallbackQuery(ctx: Context): Promise<void>;
    onEditCallbackQuery(ctx: Context): Promise<void>;
    onReactionCallbackQuery(ctx: Context): Promise<void>;
    onSettingsCallbackQuery(ctx: Context): Promise<void>;
    onStartMessageCallbackQuery(ctx: Context): Promise<void>;
    onSubscriptionMenuCallbackQuery(ctx: Context): Promise<void>;
    onCancelSubscriptionCallbackQuery(ctx: Context): Promise<void>;
    onUncancelSubscriptionCallbackQuery(ctx: Context): Promise<void>;
    onMySubscriptionsCallbackQuery(ctx: Context): Promise<void>;
    onAboutUsCallbackQuery(ctx: Context): Promise<void>;
    onAboutTeacherCallbackQuery(ctx: Context): Promise<void>;
    onJoin(ctx: Context): Promise<void>;
    onMessage(ctx: Context): Promise<void>;
}
