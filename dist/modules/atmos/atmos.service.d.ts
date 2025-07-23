import { CreateAtmosDto } from './dto/create.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionService } from '../trasnaction/transaction.service';
import { PreApplyAtmosDto } from './dto/preapply.dto';
export declare class AtmosService {
    private readonly prisma;
    private readonly transactionService;
    constructor(prisma: PrismaService, transactionService: TransactionService);
    createLink(dto: CreateAtmosDto): Promise<any>;
    preApplyTransaction(dto: PreApplyAtmosDto): Promise<any>;
    applyTransaction(dto: {
        transaction_id: number;
        otp: string;
    }): Promise<any>;
    getPendingInvoices(): Promise<{
        id: number;
        price: number;
        transactionId: string | null;
        status: import(".prisma/client").$Enums.TransactionStatus;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        userId: number;
        subscriptionTypeId: number;
        type: import(".prisma/client").$Enums.TransactionType;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    checkTransactionStatus(transactionId: string): Promise<any>;
}
