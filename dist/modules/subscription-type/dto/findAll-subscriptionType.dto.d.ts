import { PaginationDto } from 'src/common/dtos/pagination.dto';
export declare class FindAllSubscriptionTypeDto extends PaginationDto {
    title?: string;
    isDeleted?: boolean;
    oneTime?: boolean;
}
