import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllTransactionDto } from './dto/findAll-transaction.dto';
import { Prisma, Transaction } from '@prisma/client';
import { SubscriptionService } from '../subscription/subscription.service';
import { SubscriptionTypeService } from '../subscription-type/subscription-type.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
export declare class TransactionService {
    private readonly prisma;
    private readonly subscriptionService;
    private readonly subscriptionTypeService;
    constructor(prisma: PrismaService, subscriptionService: SubscriptionService, subscriptionTypeService: SubscriptionTypeService);
    create(createTransactionDto: CreateTransactionDto): Promise<{
        id: number;
        userId: number;
        transactionId: string | null;
        subscriptionTypeId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TransactionStatus;
        price: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        type: import(".prisma/client").$Enums.TransactionType;
    }>;
    findAll(dto: FindAllTransactionDto): Promise<{
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
            transactionId: string | null;
            subscriptionTypeId: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.TransactionStatus;
            price: number;
            paymentType: import(".prisma/client").$Enums.PaymentType;
            type: import(".prisma/client").$Enums.TransactionType;
        })[];
    }>;
    findOneByUserId(userId: number, dto: PaginationDto): Promise<{
        total: number;
        page: number;
        limit: number;
        data: {
            id: number;
            userId: number;
            transactionId: string | null;
            subscriptionTypeId: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.TransactionStatus;
            price: number;
            paymentType: import(".prisma/client").$Enums.PaymentType;
            type: import(".prisma/client").$Enums.TransactionType;
        }[];
    }>;
    findOneByTransactionId(transactionId: string): Promise<{
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
        transactionId: string | null;
        subscriptionTypeId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TransactionStatus;
        price: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        type: import(".prisma/client").$Enums.TransactionType;
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
        transactionId: string | null;
        subscriptionTypeId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TransactionStatus;
        price: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        type: import(".prisma/client").$Enums.TransactionType;
    }>;
    update(id: number, updateTransactionDto: UpdateTransactionDto): Promise<{
        id: number;
        userId: number;
        transactionId: string | null;
        subscriptionTypeId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TransactionStatus;
        price: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        type: import(".prisma/client").$Enums.TransactionType;
    }>;
    transactionPaid(transaction: Transaction): Promise<{
        id: number;
        userId: number;
        transactionId: string | null;
        subscriptionTypeId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TransactionStatus;
        price: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        type: import(".prisma/client").$Enums.TransactionType;
    }>;
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
        transactionId: string | null;
        subscriptionTypeId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TransactionStatus;
        price: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        type: import(".prisma/client").$Enums.TransactionType;
    }>;
}
