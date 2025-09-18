import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllSubscriptionDto } from './dto/findAll-subscription.dto';
import { Prisma } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
export declare class SubscriptionService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    activateFreeTrial(userId: number): Promise<{
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
    create(createSubscriptionDto: CreateSubscriptionDto): Promise<{
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
    findAll(dto: FindAllSubscriptionDto): Promise<{
        total: number;
        page: number;
        limit: number;
        data: ({
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
    }>;
    findOneByUserId(userId: number, dto: PaginationDto): Promise<{
        total: number;
        page: number;
        limit: number;
        data: ({
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
    }>;
    findOne(id: number): Promise<{
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
    update(id: number, updateSubscriptionDto: UpdateSubscriptionDto): Promise<{
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
    subscriptionPaid(subscription: any): Promise<any>;
    remove(id: number): Promise<{
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
}
