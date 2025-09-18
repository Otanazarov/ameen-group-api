import { AtmosService } from './atmos.service';
import { CreateAtmosDto } from './dto/create.dto';
import { PreApplyAtmosDto } from './dto/preapply.dto';
import { ApplyAtmosDto } from './dto/apply.dto';
import { BindCardInitDto } from './dto/bind-card-init.dto';
import { BindCardConfirmDto } from './dto/bind-card-confirm.dto';
import { ConfirmSchedulerDto } from './dto/confirm-scheduler.dto';
export declare class AtmosController {
    private readonly atmosService;
    constructor(atmosService: AtmosService);
    createLink(dto: CreateAtmosDto): Promise<any>;
    preapply(dto: PreApplyAtmosDto): Promise<any>;
    apply(dto: ApplyAtmosDto): Promise<any>;
    bindCardInit(dto: BindCardInitDto): Promise<any>;
    bindCardConfirm(dto: BindCardConfirmDto): Promise<{
        cardConfirmData: any;
        schedulerData: any;
    }>;
    confirmScheduler(dto: ConfirmSchedulerDto): Promise<any>;
}
