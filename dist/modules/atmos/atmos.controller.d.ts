import { AtmosService } from './atmos.service';
import { CreateAtmosDto } from './dto/create.dto';
import { PreApplyAtmosDto } from './dto/preapply.dto';
import { ApplyAtmosDto } from './dto/apply.dto';
export declare class AtmosController {
    private readonly atmosService;
    constructor(atmosService: AtmosService);
    createLink(dto: CreateAtmosDto): Promise<any>;
    preapply(dto: PreApplyAtmosDto): Promise<any>;
    apply(dto: ApplyAtmosDto): Promise<any>;
}
