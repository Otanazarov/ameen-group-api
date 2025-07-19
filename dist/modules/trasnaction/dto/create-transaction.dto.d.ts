import { PaymentType, TransactionStatus, TransactionType } from '@prisma/client';
export declare class CreateTransactionDto {
    userId: number;
    price: number;
    paymentType: PaymentType;
    type?: TransactionType;
    status: TransactionStatus;
    transactionId?: string;
    subscriptionTypeId: number;
}
