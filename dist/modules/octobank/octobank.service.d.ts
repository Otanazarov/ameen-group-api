import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { TelegramService } from '../telegram/telegram.service';
import { TransactionService } from '../trasnaction/transaction.service';
import { OctobankDto } from './dto/octobank.dto';
export declare class OctoBankService {
    private readonly prisma;
    private readonly transactionService;
    private readonly telegramService;
    constructor(prisma: PrismaService, transactionService: TransactionService, telegramService: TelegramService);
    format(date: Date): string;
    createCheckoutSession(dto: CreateSessionDto): Promise<{
        error: number;
        data: {
            shop_transaction_id: string;
            octo_payment_UUID: string;
            status: string;
            octo_pay_url: string;
            refunded_sum: number;
            total_sum: number;
        };
        apiMessageForDevelopers: string;
        shop_transaction_id: string;
        octo_payment_UUID: string;
        status: string;
        octo_pay_url: string;
        refunded_sum: number;
        total_sum: number;
    }>;
    webhook(dto: OctobankDto): Promise<boolean>;
}
