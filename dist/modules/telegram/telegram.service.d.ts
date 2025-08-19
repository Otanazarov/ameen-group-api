import { OnModuleInit } from '@nestjs/common';
import { File, Message, MessageUser, Prisma, User } from '@prisma/client';
import { Bot } from 'grammy';
import { MessageService } from '../message/message.service';
import { PrismaService } from '../prisma/prisma.service';
import { SettingsService } from '../settings/settings.service';
import { SubscriptionTypeService } from '../subscription-type/subscription-type.service';
import { UserService } from '../user/user.service';
import { Context } from './Context.type';
import { OctoBankService } from '../octobank/octobank.service';
import { ButtonsService } from '../buttons/buttons.service';
import { AtmosService } from '../atmos/atmos.service';
export declare class TelegramService implements OnModuleInit {
    readonly bot: Bot<Context>;
    private readonly userService;
    private readonly prismaService;
    private readonly subscriptionTypeService;
    private readonly settingsService;
    private readonly buttonsService;
    private readonly octobankService;
    private readonly atmosService;
    private readonly messageService;
    private cronRunning;
    private readonly MS_PER_DAY;
    private DEFAULT_KEYBOARD;
    constructor(bot: Bot<Context>, userService: UserService, prismaService: PrismaService, subscriptionTypeService: SubscriptionTypeService, settingsService: SettingsService, buttonsService: ButtonsService, octobankService: OctoBankService, atmosService: AtmosService, messageService: MessageService);
    onModuleInit(): Promise<void>;
    private setDefaultKeyboard;
    private calculateDaysLeft;
    onReactionCallBack(ctx: Context): Promise<void>;
    onSubscribeCallBack(ctx: Context): Promise<void>;
    onEditCallBack(ctx: Context): Promise<void>;
    onSettingsCallBack(ctx: Context): Promise<void>;
    onSubscriptionMenuCallBack(ctx: Context): Promise<void>;
    onStartMessageCallBack(ctx: Context): Promise<void>;
    onMySubscriptionsCallBack(ctx: Context): Promise<void>;
    onAboutUsCallBack(ctx: Context): Promise<void>;
    onAboutTeacherCallBack(ctx: Context): Promise<void>;
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
    private updateUserSession;
    handleSubscriptionPayment(ctx: Context, subscriptionTypeId: number): Promise<{
        subscriptionType: {
            price: string;
            description: string;
            title: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            oneTime: boolean;
            expireDays: number;
            isDeleted: boolean;
        };
        octobank: {
            error: number;
            data: {
                shop_transaction_id: string;
                octo_payment_UUID: string;
                status: string;
                octo_pay_url: string;
                refunded_sum: number;
                total_sum: number;
            };
            apiMessageForDevelopers: string;
            shop_transaction_id: string;
            octo_payment_UUID: string;
            status: string;
            octo_pay_url: string;
            refunded_sum: number;
            total_sum: number;
        };
        atmos: {
            type: import(".prisma/client").$Enums.TransactionType;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            subscriptionTypeId: number;
            price: number;
            paymentType: import(".prisma/client").$Enums.PaymentType;
            status: import(".prisma/client").$Enums.TransactionStatus;
            transactionId: string | null;
        };
    }>;
    onCron(): Promise<void>;
    private handleExistingUser;
    private handleStartCommand;
    private handleUserRegistration;
    private handlePhoneNumber;
    private handleEmail;
    private sendSubscriptionMenu;
    sendMessages(): Promise<void>;
    private sendSettingsMessage;
    onMessage(ctx: Context): Promise<void>;
    handleEdit(ctx: Context): Promise<boolean>;
    private sendSubscriptionPaymentInfo;
    sendAlertMessage(): Promise<void>;
    kickExpired(): Promise<void>;
    sendStartMessage(ctx: Context, type?: number): Promise<void>;
    sendNameRequest(ctx: Context, step: number): void;
    sendPhoneRequest(ctx: Context): void;
    sendEmailRequest(ctx: Context, type?: number): void;
}
