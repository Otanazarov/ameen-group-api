import { PaginationDto } from 'src/common/dtos/pagination.dto';
export declare enum SubscriptionStatus {
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED"
}
export declare class FindAllSubscriptionDto extends PaginationDto {
    userId?: number;
    subscriptionTypeId?: number;
    startDateFrom?: Date;
    status?: SubscriptionStatus;
    minPrice: number;
    maxPrice: number;
    startDateTo?: Date;
    expireDateFrom?: Date;
    expireDateTo?: Date;
    oneTime?: boolean;
}
