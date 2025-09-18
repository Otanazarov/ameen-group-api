import { CreateAtmosDto } from "./dto/create.dto";
import { PrismaService } from "../prisma/prisma.service";
import { TransactionService } from "../trasnaction/transaction.service";
import { PreApplyAtmosDto } from "./dto/preapply.dto";
import { TelegramService } from "../telegram/telegram.service";
import { BindCardInitDto } from "./dto/bind-card-init.dto";
import { BindCardConfirmDto } from "./dto/bind-card-confirm.dto";
import { ConfirmSchedulerDto } from "./dto/confirm-scheduler.dto";
export declare class AtmosService {
    private readonly prisma;
    private readonly transactionService;
    private readonly telegramService;
    constructor(prisma: PrismaService, transactionService: TransactionService, telegramService: TelegramService);
    createScheduler(dto: {
        date_start: Date;
        login: string;
        pay_day: number;
        ext_id: string;
        amount: number;
        cards: string[];
        account: string;
        repeat_interval: number;
    }): Promise<any>;
    confirmScheduler(dto: ConfirmSchedulerDto): Promise<any>;
    deleteScheduler(scheduler_id: string): Promise<any>;
    getScheduler(scheduler_id: string): Promise<any>;
    getSchedulers(login: string): Promise<any>;
    private _createScheduler;
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
    bindCardInit(dto: BindCardInitDto): Promise<any>;
    bindCardConfirm(dto: BindCardConfirmDto): Promise<{
        cardConfirmData: any;
        schedulerData: any;
    }>;
}
