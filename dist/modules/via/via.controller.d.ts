import { ViaService } from './via.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { CreateContractRequestDto } from './dto/create-contract-req.dto';
import { RegisterCardDto, VerifyCardDto } from './dto/card-registration.dto';
export declare class ViaController {
    private readonly viaService;
    private readonly subscriptionService;
    constructor(viaService: ViaService, subscriptionService: SubscriptionService);
    createContract(dto: CreateContractRequestDto): Promise<{
        subscription: {
            id: number;
            userId: number;
            transactionId: number | null;
            expiredDate: Date;
            startDate: Date;
            alertCount: number;
            subscriptionTypeId: number | null;
            viaContractId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        viaData: {
            id: string;
            contractDate: number;
            nextPayDate: number;
            status: string;
            price: number;
            deactivateDate: number | null;
            tryPaymentCount: number;
            createdDate: number;
            modifiedDate: number;
            merchant: {
                name: {
                    uz: string;
                    ru: string;
                    en: string;
                };
                logo: string;
            };
            tariff: {
                id: string;
                title: {
                    uz: string;
                    ru: string;
                    en: string;
                };
                tryCount: number;
                amount: number | string;
                period: string;
                trialDays: number;
            };
            card: {
                id: string;
                holder: string;
                type: string;
                pan: string;
                status: string;
            };
        };
    }>;
    registerCard(dto: RegisterCardDto): Promise<import("./via.interface").RegisterCardResponse>;
    verifyCard(dto: VerifyCardDto): Promise<import("./via.interface").VerifyCardResponse>;
    deactivateContract(id: string): Promise<{
        id: string;
        contractDate: number;
        nextPayDate: number;
        status: "PAUSE" | "ACTIVE" | string;
        price: number;
        deactivateDate: number;
        tryPaymentCount: number;
        createdDate: number;
        modifiedDate: number;
        merchant: {
            name: {
                uz: string;
                ru: string;
                en: string;
            };
            logo: string;
        };
        tariff: {
            id: string;
            title: {
                uz: string;
                ru: string;
                en: string;
            };
            tryCount: number;
            amount: number | string;
            period: string;
            trialDays: number;
        };
        card: {
            id: string;
            holder: string;
            type: string;
            pan: string;
            status: string;
        };
    }>;
    deleteContract(id: string): Promise<import("./via.interface").DeleteResponse>;
    getCardInfo(dto: {
        token: string;
    }): Promise<import("./via.interface").CardInfoResponse>;
    activateContract(id: string): Promise<import("./via.interface").CreateContractResponse>;
    getContractInfo(id: string): Promise<import("./via.interface").CreateContractResponse>;
}
