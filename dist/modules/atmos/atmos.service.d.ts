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
        type: import(".prisma/client").$Enums.TransactionType;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        subscriptionTypeId: number;
        price: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        status: import(".prisma/client").$Enums.TransactionStatus;
        transactionId: string | null;
    }[]>;
    checkTransactionStatus(transactionId: string): Promise<any>;
}
