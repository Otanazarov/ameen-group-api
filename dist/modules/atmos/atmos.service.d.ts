import { CreateAtmosDto } from "./dto/create.dto";
import { PrismaService } from "../prisma/prisma.service";
import { TransactionService } from "../trasnaction/transaction.service";
import { PreApplyAtmosDto } from "./dto/preapply.dto";
import { TelegramService } from "../telegram/telegram.service";
export declare class AtmosService {
    private readonly prisma;
    private readonly transactionService;
    private readonly telegramService;
    constructor(prisma: PrismaService, transactionService: TransactionService, telegramService: TelegramService);
    createLink(dto: CreateAtmosDto): Promise<{
        id: number;
        price: number;
        createdAt: Date;
        updatedAt: Date;
        transactionId: string | null;
        status: import(".prisma/client").$Enums.TransactionStatus;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        userId: number;
        subscriptionTypeId: number;
        type: import(".prisma/client").$Enums.TransactionType;
    }>;
    preApplyTransaction(dto: PreApplyAtmosDto): Promise<any>;
    applyTransaction(dto: {
        transaction_id: number;
        otp: string;
    }): Promise<any>;
    getPendingInvoices(): Promise<{
        id: number;
        price: number;
        createdAt: Date;
        updatedAt: Date;
        transactionId: string | null;
        status: import(".prisma/client").$Enums.TransactionStatus;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        userId: number;
        subscriptionTypeId: number;
        type: import(".prisma/client").$Enums.TransactionType;
    }[]>;
    checkTransactionStatus(transactionId: string): Promise<any>;
}
