import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUserDto } from './dto/findAll-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
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
            cards: import("@prisma/client/runtime/library").JsonValue;
            schedulerId: string | null;
            email: string | null;
            phoneNumber: string;
            inGroup: boolean;
            trialUsed: boolean;
        })[];
    }>;
    findOne(id: string): Promise<{
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
        cards: import("@prisma/client/runtime/library").JsonValue;
        schedulerId: string | null;
        email: string | null;
        phoneNumber: string;
        inGroup: boolean;
        trialUsed: boolean;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
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
        cards: import("@prisma/client/runtime/library").JsonValue;
        schedulerId: string | null;
        email: string | null;
        phoneNumber: string;
        inGroup: boolean;
        trialUsed: boolean;
    }>;
}
