import { AtmosService } from './modules/atmos/atmos.service';
export declare class AppService {
    private readonly atmosService;
    constructor(atmosService: AtmosService);
    onModuleInit(): void;
}
