import { OctobankDto } from './dto/octobank.dto';
import { OctoBankService } from './octobank.service';
import { CreateSessionDto } from './dto/create-session.dto';
export declare class OctoBankController {
    private readonly octobankService;
    constructor(octobankService: OctoBankService);
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
    handleWebhook(dto: OctobankDto): Promise<boolean>;
}
