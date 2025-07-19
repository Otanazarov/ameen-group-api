import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllTransactionDto } from './dto/findAll-transaction.dto';
import { Transaction } from '@prisma/client';
import { SubscriptionService } from '../subscription/subscription.service';
import { SubscriptionTypeService } from '../subscription-type/subscription-type.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
export declare class TransactionService {
    private readonly prisma;
    private readonly subscriptionService;
    private readonly subscriptionTypeService;
    constructor(prisma: PrismaService, subscriptionService: SubscriptionService, subscriptionTypeService: SubscriptionTypeService);
    create(createTransactionDto: CreateTransactionDto): Promise<{
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
    }>;
    findAll(dto: FindAllTransactionDto): Promise<{
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
                email: string | null;
                phoneNumber: string;
                inGroup: boolean;
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
        })[];
    }>;
    findOneByUserId(userId: number, dto: PaginationDto): Promise<{
        total: number;
        page: number;
        limit: number;
        data: {
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
    }>;
    findOneByTransactionId(transactionId: string): Promise<{
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
            email: string | null;
            phoneNumber: string;
            inGroup: boolean;
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
            email: string | null;
            phoneNumber: string;
            inGroup: boolean;
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
    }>;
    update(id: number, updateTransactionDto: UpdateTransactionDto): Promise<{
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
    }>;
    transactionPaid(transaction: Transaction): Promise<{
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
    }>;
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
            email: string | null;
            phoneNumber: string;
            inGroup: boolean;
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
    }>;
}
