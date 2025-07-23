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
    findOneByUser(id: string, dto: PaginationDto): Promise<{
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
    findOne(id: string): Promise<{
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
    update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<{
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
    remove(id: string): Promise<{
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
