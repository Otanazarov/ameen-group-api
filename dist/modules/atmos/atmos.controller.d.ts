import { AtmosService } from './atmos.service';
import { CreateAtmosDto } from './dto/create.dto';
import { PreApplyAtmosDto } from './dto/preapply.dto';
import { ApplyAtmosDto } from './dto/apply.dto';
export declare class AtmosController {
    private readonly atmosService;
    constructor(atmosService: AtmosService);
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
    preapply(dto: PreApplyAtmosDto): Promise<any>;
    apply(dto: ApplyAtmosDto): Promise<any>;
}
