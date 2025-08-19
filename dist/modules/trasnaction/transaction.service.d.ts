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
        id: number;
        price: number;
        transactionId: string | null;
        status: import(".prisma/client").$Enums.TransactionStatus;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        userId: number;
        subscriptionTypeId: number;
        type: import(".prisma/client").$Enums.TransactionType;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(dto: FindAllTransactionDto): Promise<{
        total: number;
        page: number;
        limit: number;
        data: ({
            user: {
                id: number;
                status: import(".prisma/client").$Enums.UserStatus;
                createdAt: Date;
                updatedAt: Date;
                telegramId: string;
                username: string | null;
                firstName: string;
                lastName: string;
                lastActiveAt: Date | null;
                email: string | null;
                phoneNumber: string;
                inGroup: boolean;
                role: import(".prisma/client").$Enums.UserRole;
            };
            subscriptionType: {
                id: number;
                price: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string;
                expireDays: number;
                isDeleted: boolean;
                oneTime: boolean;
            };
        } & {
            id: number;
            price: number;
            transactionId: string | null;
            status: import(".prisma/client").$Enums.TransactionStatus;
            paymentType: import(".prisma/client").$Enums.PaymentType;
            userId: number;
            subscriptionTypeId: number;
            type: import(".prisma/client").$Enums.TransactionType;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    findOneByUserId(userId: number, dto: PaginationDto): Promise<{
        total: number;
        page: number;
        limit: number;
        data: {
            id: number;
            price: number;
            transactionId: string | null;
            status: import(".prisma/client").$Enums.TransactionStatus;
            paymentType: import(".prisma/client").$Enums.PaymentType;
            userId: number;
            subscriptionTypeId: number;
            type: import(".prisma/client").$Enums.TransactionType;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    findOneByTransactionId(transactionId: string): Promise<{
        user: {
            id: number;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
            telegramId: string;
            username: string | null;
            firstName: string;
            lastName: string;
            lastActiveAt: Date | null;
            email: string | null;
            phoneNumber: string;
            inGroup: boolean;
            role: import(".prisma/client").$Enums.UserRole;
        };
        subscriptionType: {
            id: number;
            price: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            expireDays: number;
            isDeleted: boolean;
            oneTime: boolean;
        };
    } & {
        id: number;
        price: number;
        transactionId: string | null;
        status: import(".prisma/client").$Enums.TransactionStatus;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        userId: number;
        subscriptionTypeId: number;
        type: import(".prisma/client").$Enums.TransactionType;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: number): Promise<{
        user: {
            id: number;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
            telegramId: string;
            username: string | null;
            firstName: string;
            lastName: string;
            lastActiveAt: Date | null;
            email: string | null;
            phoneNumber: string;
            inGroup: boolean;
            role: import(".prisma/client").$Enums.UserRole;
        };
        subscriptionType: {
            id: number;
            price: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            expireDays: number;
            isDeleted: boolean;
            oneTime: boolean;
        };
    } & {
        id: number;
        price: number;
        transactionId: string | null;
        status: import(".prisma/client").$Enums.TransactionStatus;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        userId: number;
        subscriptionTypeId: number;
        type: import(".prisma/client").$Enums.TransactionType;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, updateTransactionDto: UpdateTransactionDto): Promise<{
        id: number;
        price: number;
        transactionId: string | null;
        status: import(".prisma/client").$Enums.TransactionStatus;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        userId: number;
        subscriptionTypeId: number;
        type: import(".prisma/client").$Enums.TransactionType;
        createdAt: Date;
        updatedAt: Date;
    }>;
    transactionPaid(transaction: Transaction): Promise<{
        id: number;
        price: number;
        transactionId: string | null;
        status: import(".prisma/client").$Enums.TransactionStatus;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        userId: number;
        subscriptionTypeId: number;
        type: import(".prisma/client").$Enums.TransactionType;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        user: {
            id: number;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
            telegramId: string;
            username: string | null;
            firstName: string;
            lastName: string;
            lastActiveAt: Date | null;
            email: string | null;
            phoneNumber: string;
            inGroup: boolean;
            role: import(".prisma/client").$Enums.UserRole;
        };
        subscriptionType: {
            id: number;
            price: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            expireDays: number;
            isDeleted: boolean;
            oneTime: boolean;
        };
    } & {
        id: number;
        price: number;
        transactionId: string | null;
        status: import(".prisma/client").$Enums.TransactionStatus;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        userId: number;
        subscriptionTypeId: number;
        type: import(".prisma/client").$Enums.TransactionType;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
