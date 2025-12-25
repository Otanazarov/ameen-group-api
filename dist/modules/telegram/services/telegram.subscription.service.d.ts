import { AtmosService } from 'src/modules/atmos/atmos.service';
import { OctoBankService } from 'src/modules/octobank/octobank.service';
import { SubscriptionTypeService } from 'src/modules/subscription-type/subscription-type.service';
import { UserService } from 'src/modules/user/user.service';
import { Context } from '../Context.type';
export declare class TelegramSubscriptionService {
    private readonly userService;
    private readonly subscriptionTypeService;
    private readonly octobankService;
    private readonly atmosService;
    private readonly MS_PER_DAY;
    constructor(userService: UserService, subscriptionTypeService: SubscriptionTypeService, octobankService: OctoBankService, atmosService: AtmosService);
    calculateDaysLeft(expiredDate: Date): number;
    handleSubscriptionPayment(ctx: Context, subscriptionTypeId: number): Promise<{
        subscriptionType: {
            price: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            expireDays: number;
            isDeleted: boolean;
            oneTime: boolean;
            viaTariffId: string | null;
        };
        octobank: {
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
        };
        atmos: any;
    }>;
}
