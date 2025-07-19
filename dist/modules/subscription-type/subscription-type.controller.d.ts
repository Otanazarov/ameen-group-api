import { SubscriptionTypeService } from './subscription-type.service';
import { CreateSubscriptionTypeDto } from './dto/create-subscription-type.dto';
import { UpdateSubscriptionTypeDto } from './dto/update-subscription-type.dto';
import { FindAllSubscriptionTypeDto } from './dto/findAll-subscriptionType.dto';
export declare class SubscriptionTypeController {
    private readonly subscriptionTypeService;
    constructor(subscriptionTypeService: SubscriptionTypeService);
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
    findOne(id: string): Promise<{
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
    update(id: string, updateSubscriptionTypeDto: UpdateSubscriptionTypeDto): Promise<{
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
    remove(id: string): Promise<{
        message: string;
    }>;
}
