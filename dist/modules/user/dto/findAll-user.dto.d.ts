import { UserStatus } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
export declare enum SubscriptionStatus {
    SUBSCRIBED = "SUBSCRIBED",
    EXPIRED = "EXPIRED"
}
export declare class FindAllUserDto extends PaginationDto {
    name?: string;
    phoneNumber?: string;
    telegramId?: string;
    status?: UserStatus;
    subscriptionStatus?: SubscriptionStatus;
    subscriptionTypeId?: number;
}
