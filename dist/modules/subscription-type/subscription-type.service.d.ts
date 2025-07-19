import { CreateSubscriptionTypeDto } from './dto/create-subscription-type.dto';
import { UpdateSubscriptionTypeDto } from './dto/update-subscription-type.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllSubscriptionTypeDto } from './dto/findAll-subscriptionType.dto';
export declare class SubscriptionTypeService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createSubscriptionTypeDto: CreateSubscriptionTypeDto): Promise<{
        price: string;
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        oneTime: boolean;
        expireDays: number;
        isDeleted: boolean;
    }>;
    findAll(dto: FindAllSubscriptionTypeDto): Promise<{
        total: number;
        page: number;
        limit: number;
        data: {
            price: string;
            description: string;
            title: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            oneTime: boolean;
            expireDays: number;
            isDeleted: boolean;
        }[];
    }>;
    findOne(id: number): Promise<{
        price: string;
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        oneTime: boolean;
        expireDays: number;
        isDeleted: boolean;
    }>;
    update(id: number, dto: UpdateSubscriptionTypeDto): Promise<{
        price: string;
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        oneTime: boolean;
        expireDays: number;
        isDeleted: boolean;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
