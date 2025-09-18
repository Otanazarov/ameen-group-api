import { PaymentType, TransactionStatus } from "@prisma/client";
export declare class UpdateTransactionDto {
    transactionId?: string;
    userId?: number;
    status?: TransactionStatus;
    price?: number;
    paymentType?: PaymentType;
    subscriptionTypeId?: number;
}
