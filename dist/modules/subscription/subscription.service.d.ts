import { Prisma } from '@prisma/client';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllSubscriptionDto } from './dto/findAll-subscription.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ViaService } from '../via/via.service';
export declare class SubscriptionService {
    private readonly prisma;
    private readonly viaService;
    constructor(prisma: PrismaService, viaService: ViaService);
    activateFreeTrial(userId: number): Promise<{
        user: {
            id: number;
            viaContractId: string | null;
            createdAt: Date;
            updatedAt: Date;
            telegramId: string;
            username: string | null;
            firstName: string;
            lastName: string;
            lastActiveAt: Date | null;
            cards: Prisma.JsonValue;
            schedulerId: string | null;
            email: string | null;
            phoneNumber: string;
            inGroup: boolean;
            status: import(".prisma/client").$Enums.UserStatus;
            role: import(".prisma/client").$Enums.UserRole;
            trialUsed: boolean;
        };
        subscriptionType: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            title: string;
            description: string;
            expireDays: number;
            isDeleted: boolean;
            oneTime: boolean;
            viaTariffId: string | null;
        };
    } & {
        id: number;
        userId: number;
        transactionId: number | null;
        expiredDate: Date;
        startDate: Date;
        alertCount: number;
        subscriptionTypeId: number | null;
        viaContractId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(createSubscriptionDto: CreateSubscriptionDto): Promise<{
        user: {
            id: number;
            viaContractId: string | null;
            createdAt: Date;
            updatedAt: Date;
            telegramId: string;
            username: string | null;
            firstName: string;
            lastName: string;
            lastActiveAt: Date | null;
            cards: Prisma.JsonValue;
            schedulerId: string | null;
            email: string | null;
            phoneNumber: string;
            inGroup: boolean;
            status: import(".prisma/client").$Enums.UserStatus;
            role: import(".prisma/client").$Enums.UserRole;
            trialUsed: boolean;
        };
        subscriptionType: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            title: string;
            description: string;
            expireDays: number;
            isDeleted: boolean;
            oneTime: boolean;
            viaTariffId: string | null;
        };
    } & {
        id: number;
        userId: number;
        transactionId: number | null;
        expiredDate: Date;
        startDate: Date;
        alertCount: number;
        subscriptionTypeId: number | null;
        viaContractId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(dto: FindAllSubscriptionDto): Promise<{
        total: number;
        page: number;
        limit: number;
        data: ({
            user: {
                id: number;
                viaContractId: string | null;
                createdAt: Date;
                updatedAt: Date;
                telegramId: string;
                username: string | null;
                firstName: string;
                lastName: string;
                lastActiveAt: Date | null;
                cards: Prisma.JsonValue;
                schedulerId: string | null;
                email: string | null;
                phoneNumber: string;
                inGroup: boolean;
                status: import(".prisma/client").$Enums.UserStatus;
                role: import(".prisma/client").$Enums.UserRole;
                trialUsed: boolean;
            };
            subscriptionType: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                price: number;
                title: string;
                description: string;
                expireDays: number;
                isDeleted: boolean;
                oneTime: boolean;
                viaTariffId: string | null;
            };
        } & {
            id: number;
            userId: number;
            transactionId: number | null;
            expiredDate: Date;
            startDate: Date;
            alertCount: number;
            subscriptionTypeId: number | null;
            viaContractId: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    findOneByUserId(userId: number, dto: PaginationDto): Promise<{
        total: number;
        page: number;
        limit: number;
        data: ({
            subscriptionType: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                price: number;
                title: string;
                description: string;
                expireDays: number;
                isDeleted: boolean;
                oneTime: boolean;
                viaTariffId: string | null;
            };
        } & {
            id: number;
            userId: number;
            transactionId: number | null;
            expiredDate: Date;
            startDate: Date;
            alertCount: number;
            subscriptionTypeId: number | null;
            viaContractId: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    findOne(id: number): Promise<{
        user: {
            id: number;
            viaContractId: string | null;
            createdAt: Date;
            updatedAt: Date;
            telegramId: string;
            username: string | null;
            firstName: string;
            lastName: string;
            lastActiveAt: Date | null;
            cards: Prisma.JsonValue;
            schedulerId: string | null;
            email: string | null;
            phoneNumber: string;
            inGroup: boolean;
            status: import(".prisma/client").$Enums.UserStatus;
            role: import(".prisma/client").$Enums.UserRole;
            trialUsed: boolean;
        };
        subscriptionType: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            title: string;
            description: string;
            expireDays: number;
            isDeleted: boolean;
            oneTime: boolean;
            viaTariffId: string | null;
        };
    } & {
        id: number;
        userId: number;
        transactionId: number | null;
        expiredDate: Date;
        startDate: Date;
        alertCount: number;
        subscriptionTypeId: number | null;
        viaContractId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, updateSubscriptionDto: UpdateSubscriptionDto): Promise<{
        id: number;
        userId: number;
        transactionId: number | null;
        expiredDate: Date;
        startDate: Date;
        alertCount: number;
        subscriptionTypeId: number | null;
        viaContractId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    subscriptionPaid(subscription: any): Promise<any>;
    remove(id: number): Promise<{
        user: {
            id: number;
            viaContractId: string | null;
            createdAt: Date;
            updatedAt: Date;
            telegramId: string;
            username: string | null;
            firstName: string;
            lastName: string;
            lastActiveAt: Date | null;
            cards: Prisma.JsonValue;
            schedulerId: string | null;
            email: string | null;
            phoneNumber: string;
            inGroup: boolean;
            status: import(".prisma/client").$Enums.UserStatus;
            role: import(".prisma/client").$Enums.UserRole;
            trialUsed: boolean;
        };
        subscriptionType: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            title: string;
            description: string;
            expireDays: number;
            isDeleted: boolean;
            oneTime: boolean;
            viaTariffId: string | null;
        };
    } & {
        id: number;
        userId: number;
        transactionId: number | null;
        expiredDate: Date;
        startDate: Date;
        alertCount: number;
        subscriptionTypeId: number | null;
        viaContractId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createViaSubscription(userId: number, subscriptionTypeId: number, cardToken: string): Promise<{
        subscription: {
            id: number;
            userId: number;
            transactionId: number | null;
            expiredDate: Date;
            startDate: Date;
            alertCount: number;
            subscriptionTypeId: number | null;
            viaContractId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        viaData: {
            id: string;
            contractDate: number;
            nextPayDate: number;
            status: string;
            price: number;
            deactivateDate: number | null;
            tryPaymentCount: number;
            createdDate: number;
            modifiedDate: number;
            merchant: {
                name: {
                    uz: string;
                    ru: string;
                    en: string;
                };
                logo: string;
            };
            tariff: {
                id: string;
                title: {
                    uz: string;
                    ru: string;
                    en: string;
                };
                tryCount: number;
                amount: number | string;
                period: string;
                trialDays: number;
            };
            card: {
                id: string;
                holder: string;
                type: string;
                pan: string;
                status: string;
            };
        };
    }>;
    deactivateViaSubscription(contractId: string): Promise<{
        id: string;
        contractDate: number;
        nextPayDate: number;
        status: "PAUSE" | "ACTIVE" | string;
        price: number;
        deactivateDate: number;
        tryPaymentCount: number;
        createdDate: number;
        modifiedDate: number;
        merchant: {
            name: {
                uz: string;
                ru: string;
                en: string;
            };
            logo: string;
        };
        tariff: {
            id: string;
            title: {
                uz: string;
                ru: string;
                en: string;
            };
            tryCount: number;
            amount: number | string;
            period: string;
            trialDays: number;
        };
        card: {
            id: string;
            holder: string;
            type: string;
            pan: string;
            status: string;
        };
    }>;
    deleteViaSubscription(contractId: string): Promise<import("../via/via.interface").DeleteResponse>;
}
