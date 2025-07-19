import { PaymentType, TransactionType } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
export declare class FindAllTransactionDto extends PaginationDto {
    userId?: number;
    username: string;
    phone: string;
    subscriptionTypeId?: number;
    type?: TransactionType;
    paymentType?: PaymentType;
    oneTime?: boolean;
}
