import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllMessageDto } from './dto/findAllMessage.dto';
import { FindAllMessageUserDto } from './dto/findAllMessageUser.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
export declare class MessageService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createMessageDto: CreateMessageDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
    }>;
    findAll(dto: FindAllMessageDto): Promise<{
        total: number;
        page: number;
        limit: number;
        data: ({
            _count: {
                users: number;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            text: string;
        })[];
    }>;
    findOneByUserId(userId: number, dto: PaginationDto): Promise<{
        total: number;
        page: number;
        limit: number;
        data: ({
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
    }>;
    findAllUser(dto: FindAllMessageUserDto): Promise<{
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
    }>;
    findOne(id: number): Promise<{
        users: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            status: import(".prisma/client").$Enums.MessageStatus;
            messageId: number | null;
        }[];
        buttonPlacement: ({
            button: {
                default: boolean;
                id: number;
                data: string | null;
                url: string | null;
                text: string;
            };
        } & {
            id: string;
            messageId: number;
            buttonId: number;
            row: number;
            column: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
    }>;
    findOneUser(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        status: import(".prisma/client").$Enums.MessageStatus;
        messageId: number | null;
    }>;
    update(id: number, updateMessageDto: UpdateMessageDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        status: import(".prisma/client").$Enums.MessageStatus;
        messageId: number | null;
    }>;
}
