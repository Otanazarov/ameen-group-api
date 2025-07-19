import { PaymentType, TransactionStatus } from '@prisma/client';
export declare class UpdateTransactionDto {
    userId?: number;
    status?: TransactionStatus;
    price?: number;
    paymentType?: PaymentType;
    subscriptionTypeId?: number;
}
