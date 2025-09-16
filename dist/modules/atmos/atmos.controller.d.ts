import { AtmosService } from './atmos.service';
import { CreateAtmosDto } from './dto/create.dto';
import { PreApplyAtmosDto } from './dto/preapply.dto';
import { ApplyAtmosDto } from './dto/apply.dto';
export declare class AtmosController {
    private readonly atmosService;
    constructor(atmosService: AtmosService);
    createLink(dto: CreateAtmosDto): Promise<{
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
    }>;
    preapply(dto: PreApplyAtmosDto): Promise<any>;
    apply(dto: ApplyAtmosDto): Promise<any>;
}
