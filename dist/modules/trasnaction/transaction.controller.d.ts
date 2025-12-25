import { TransactionService } from './transaction.service';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FindAllTransactionDto } from './dto/findAll-transaction.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
export declare class TransactionController {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
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
    findOneByUser(id: string, dto: PaginationDto): Promise<{
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
        transactionId: string | null;
        subscriptionTypeId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TransactionStatus;
        price: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        type: import(".prisma/client").$Enums.TransactionType;
    }>;
    update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<{
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
