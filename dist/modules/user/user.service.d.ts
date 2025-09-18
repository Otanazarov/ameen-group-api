import { OnModuleInit } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { FindAllUserDto } from "./dto/findAll-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
export declare class UserService implements OnModuleInit {
    private readonly prisma;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    create(createUserDto: CreateUserDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        username: string | null;
        telegramId: string;
        firstName: string;
        lastName: string;
        lastActiveAt: Date | null;
        cards: Prisma.JsonValue;
        schedulerId: string | null;
        email: string | null;
        phoneNumber: string;
        inGroup: boolean;
        trialUsed: boolean;
    }>;
    findAll(dto: FindAllUserDto): Promise<{
        total: number;
        page: number;
        limit: number;
        data: ({
            subscription: ({
                subscriptionType: {
                    description: string;
                    title: string;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    price: number;
                    oneTime: boolean;
                    expireDays: number;
                    isDeleted: boolean;
                };
            } & {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                userId: number;
                subscriptionTypeId: number | null;
                transactionId: number | null;
                startDate: Date;
                expiredDate: Date;
                alertCount: number;
            })[];
            transaction: {
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
            }[];
            messageUser: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                userId: number;
                status: import(".prisma/client").$Enums.MessageStatus;
                messageId: number | null;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            username: string | null;
            telegramId: string;
            firstName: string;
            lastName: string;
            lastActiveAt: Date | null;
            cards: Prisma.JsonValue;
            schedulerId: string | null;
            email: string | null;
            phoneNumber: string;
            inGroup: boolean;
            trialUsed: boolean;
        })[];
    }>;
    getSubscription(telegramId: number, checkStatus?: boolean): Promise<{
        user: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            username: string | null;
            telegramId: string;
            firstName: string;
            lastName: string;
            lastActiveAt: Date | null;
            cards: Prisma.JsonValue;
            schedulerId: string | null;
            email: string | null;
            phoneNumber: string;
            inGroup: boolean;
            trialUsed: boolean;
        };
        transaction: {
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
        subscriptionType: {
            description: string;
            title: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            oneTime: boolean;
            expireDays: number;
            isDeleted: boolean;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        subscriptionTypeId: number | null;
        transactionId: number | null;
        startDate: Date;
        expiredDate: Date;
        alertCount: number;
    }>;
    cancelSubscription(telegramId: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        username: string | null;
        telegramId: string;
        firstName: string;
        lastName: string;
        lastActiveAt: Date | null;
        cards: Prisma.JsonValue;
        schedulerId: string | null;
        email: string | null;
        phoneNumber: string;
        inGroup: boolean;
        trialUsed: boolean;
    }>;
    uncancelSubscription(telegramId: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        username: string | null;
        telegramId: string;
        firstName: string;
        lastName: string;
        lastActiveAt: Date | null;
        cards: Prisma.JsonValue;
        schedulerId: string | null;
        email: string | null;
        phoneNumber: string;
        inGroup: boolean;
        trialUsed: boolean;
    }>;
    findOneByTelegramID(id: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        username: string | null;
        telegramId: string;
        firstName: string;
        lastName: string;
        lastActiveAt: Date | null;
        cards: Prisma.JsonValue;
        schedulerId: string | null;
        email: string | null;
        phoneNumber: string;
        inGroup: boolean;
        trialUsed: boolean;
    }>;
    findOne(id: number): Promise<{
        subscription: ({
            subscriptionType: {
                description: string;
                title: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                price: number;
                oneTime: boolean;
                expireDays: number;
                isDeleted: boolean;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            subscriptionTypeId: number | null;
            transactionId: number | null;
            startDate: Date;
            expiredDate: Date;
            alertCount: number;
        })[];
        transaction: {
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
        }[];
        messageUser: ({
            message: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                text: string;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            status: import(".prisma/client").$Enums.MessageStatus;
            messageId: number | null;
        })[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        username: string | null;
        telegramId: string;
        firstName: string;
        lastName: string;
        lastActiveAt: Date | null;
        cards: Prisma.JsonValue;
        schedulerId: string | null;
        email: string | null;
        phoneNumber: string;
        inGroup: boolean;
        trialUsed: boolean;
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        username: string | null;
        telegramId: string;
        firstName: string;
        lastName: string;
        lastActiveAt: Date | null;
        cards: Prisma.JsonValue;
        schedulerId: string | null;
        email: string | null;
        phoneNumber: string;
        inGroup: boolean;
        trialUsed: boolean;
    }>;
}
