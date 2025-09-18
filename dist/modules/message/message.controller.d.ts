import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { FindAllMessageDto } from './dto/findAllMessage.dto';
import { FindAllMessageUserDto } from './dto/findAllMessageUser.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
export declare class MessageController {
    private readonly messageService;
    constructor(messageService: MessageService);
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
                cards: import("@prisma/client/runtime/library").JsonValue;
                schedulerId: string | null;
                email: string | null;
                phoneNumber: string;
                inGroup: boolean;
                trialUsed: boolean;
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
    findOneByUser(id: string, dto: PaginationDto): Promise<{
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
    findOneUser(id: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        status: import(".prisma/client").$Enums.MessageStatus;
        messageId: number | null;
    }>;
    findOne(id: string): Promise<{
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
            buttonId: number;
            row: number;
            column: number;
            messageId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
    }>;
    update(id: string, updateMessageDto: UpdateMessageDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        status: import(".prisma/client").$Enums.MessageStatus;
        messageId: number | null;
    }>;
}
