import { SubscriptionService } from './subscription.service';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { FindAllSubscriptionDto } from './dto/findAll-subscription.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
export declare class SubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    activateFreeTrial(id: string): Promise<{
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
            cards: import("@prisma/client/runtime/library").JsonValue;
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
                cards: import("@prisma/client/runtime/library").JsonValue;
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
    findOneByUser(id: string, dto: PaginationDto): Promise<{
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
    findOne(id: string): Promise<{
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
            cards: import("@prisma/client/runtime/library").JsonValue;
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
    update(id: string, updateSubscriptionDto: UpdateSubscriptionDto): Promise<{
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
    remove(id: string): Promise<{
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
            cards: import("@prisma/client/runtime/library").JsonValue;
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
}
