import { ButtonsService } from './buttons.service';
import { CreateButtonDto } from './dto/create-buttons.dto';
import { UpdateButtonDto } from './dto/update-buttons.dto';
import { FindAllButtonDto } from './dto/findAll-buttons.dto';
export declare class ButtonsController {
    private readonly buttonsService;
    constructor(buttonsService: ButtonsService);
    create(createButtonDto: CreateButtonDto): Promise<{
        default: boolean;
        id: number;
        data: string | null;
        url: string | null;
        text: string;
    }>;
    findAll(dto: FindAllButtonDto): Promise<{
        total: number;
        page: number;
        limit: number;
        data: {
            default: boolean;
            id: number;
            data: string | null;
            url: string | null;
            text: string;
        }[];
    }>;
    findOne(id: number): Promise<{
        default: boolean;
        id: number;
        data: string | null;
        url: string | null;
        text: string;
    }>;
    update(id: number, updateButtonDto: UpdateButtonDto): Promise<{
        default: boolean;
        id: number;
        data: string | null;
        url: string | null;
        text: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
